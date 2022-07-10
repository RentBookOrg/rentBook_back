import { NotFoundError, ValidationError, InternalServerError } from "#error";
import joi from "#joi";
import sendEmail from "./sendEmail.js";
import Sequelize from "sequelize";

const GET_ORDER = async (req, res, next) => {
  try {
    // make lowercase the mode of the book
    req.params.mode = req.params.mode.toLowerCase();
    // check if valid mode
    if (!["rent", "buy"].includes(req.params.mode)) {
      next(
        new ValidationError(
          400,
          'Invalid mode. Mode should be either "rent" or "buy"'
        )
      );
      return;
    }
    // get specific book from db
    let book = undefined;
    try {
      // book = await req.models.Book.findOne({ where: { book_id: req.params.book_id } })
      book = await req.models.Book.findOne(
        { where: { book_id: req.params.book_id } },
        { type: Sequelize.QueryTypes.SELECT }
      );
      book = JSON.parse(JSON.stringify(book, null, 4));
      console.log(book);
    } catch (error) {
      next(new ValidationError(400, error.message));
      return;
    }
    // validation
    if (!book) {
      next(new NotFoundError(404, "The book is not fount"));
      return;
    }
    // availability of the book
    if (!book.book_available) {
      next(new ValidationError(400, "This book is not available now"));
      return;
    }
    // validate body
    const { error, value } = joi.order(req.body);

    // if invalid body throw error
    if (error) {
      next(new ValidationError(400, error.message));
      return;
    }

    const user = await req.models.User.findOne({
      where: { user_id: book.user_id },
    });
    // split task according to the mode
    if (req.params.mode == "rent") {
      let order = undefined;
      try {
        order = await req.models.Order.create({
          name: req.body.name,
          surname: req.body.surname,
          phone: req.body.phone,
          email: req.body.email,
          order_mode: "rent",
          address: req.body.address,
          order_returning_date: req.body.order_returning_date,
          book_id: book.book_id,
        });
      } catch (error) {
        next(new ValidationError(400, error.message));
        return;
      }

      // send eamil to approve
      let data = {
        order_id: order.order_id,
        name: req.body.name,
        surname: req.body.surname,
        order_mode: "rent",
        address: req.body.address,
        book_id: book.book_id,
        book_name: book.book_name,
      };

      await sendEmail(
        data,
        `You have new order. Please, see the user info and approve or reject it`,
        user.user_email,
        "order"
      );

      res.status(200).json({
        status: 200,
        message: "Order email is sent",
        order_id: order.order_id,
      });
    } else if (req.params.mode == "buy") {
      let order = undefined;
      try {
        order = await req.models.Order.create({
          name: req.body.name,
          surname: req.body.surname,
          phone: req.body.phone,
          email: req.body.email,
          order_mode: "buy",
          address: req.body.address,
          book_id: book.book_id,
        });
      } catch (error) {
        next(new ValidationError(400, error.message));
        return;
      }

      // send eamil to approve
      let data = {
        order_id: order.order_id,
        name: req.body.name,
        surname: req.body.surname,
        order_mode: "buy",
        address: req.body.address,
        book_id: book.book_id,
        book_name: book.book_name,
      };

      await sendEmail(
        data,
        `You have new order. Please, see the user info and approve or reject it`,
        user.user_email,
        "buy"
      );
      res.status(200).json({
        status: 200,
        message: "Order email is sent successfully",
        order_id: order.order_id,
      });
    }
  } catch (error) {
    next(new InternalServerError(500, error.message));
  }
};

const APPROVE_RENT = async (req, res, next) => {
  try {
    // get order from db with full info
    let order = undefined;
    try {
      order = await req.models.Order.findOne({
        where: { book_id: req.params.book_id },
      });
    } catch (error) {
      next(new ValidationError(400, error.message));
      return;
    }

    // checking
    if (!order) {
      next(new NotFoundError(404, "The order is not fount"));
      return;
    }

    //get book info from order
    let book = await req.models.Book.findOne({
      where: { book_id: order.book_id },
    });
    // update order info
    book.book_count = book.book_count <= 0 ? 0 : book.book_count - 1;
    if (book.book_count == 0) {
      book.book_available = false;
    }
    order.order_approved = true;
    // save updated info
    await order.save();
    await book.save();

    let owner = req.models.User.findOne({
      where: { user_id: book.user_id },
      attributes: ["user_id", "name", "user_contact", "user_email"],
    });
    // create overall data to send
    let data = {
      order_id: order.order_id,
      book_id: order.book_id,
      book_name: book.book_name,
      owner: owner.name,
      owner_phone: owner.user_contact,
      owner_email: owner.user_email,
      order_returning_date: order.order_returning_date,
    };
    await sendEmail(
      data,
      "Your order is approved by the owner",
      order.email,
      "approve"
    );

    // send notification after specific time
    let returningTime = new Date(order.order_returning_date).getTime();
    setTimeout(async () => {
      await sendEmail(
        data,
        "It is time to send the book back to the owner",
        order.email,
        "return"
      );
    }, returningTime);

    res.redirect(301, `${process.env.SERVER_HOST}:4000/cabinet`);
  } catch (error) {
    next(new InternalServerError(500, error.message));
  }
};

const REJECT_RENT = async (req, res, next) => {
  try {
    // get order from db with full info
    let order = undefined;
    try {
      order = await req.models.Order.findOne(
        { where: { book_id: req.params.book_id } },
        { type: Sequelize.QueryTypes.SELECT }
      );
    } catch (error) {
      next(new ValidationError(400, error.message));
      return;
    }

    // checking
    if (!order) {
      next(new NotFoundError(404, "The order is not fount"));
      return;
    }
    // get book info from order
    let book = await req.models.Book.findOne(
      { where: { book_id: order.book_id } },
      { type: Sequelize.QueryTypes.SELECT }
    );
    // create overall data to send
    let data = {
      book_id: order.book_id,
      book_name: book.book_name,
      order_id: order.order_id,
    };
    await sendEmail(
      data,
      "Your order is rejected by the owner",
      order.email,
      "reject"
    );

    res.redirect(301, `${process.env.SERVER_HOST}:4000/cabinet`);
  } catch (error) {
    next(new InternalServerError(500, error.message));
  }
};

const APPROVE_BUY = async (req, res, next) => {
  try {
    let order = undefined;
    try {
      order = await req.models.Order.findOne({
        where: { order_id: req.params.order_id },
      });
    } catch (error) {
      next(new ValidationError(400, error.message));
      return;
    }

    if (!order) {
      next(new NotFoundError(404, "The order is not fount"));
      return;
    }

    const book = await req.models.Book.findOne({
      where: { book_id: order.book_id },
    });

    // update order info
    book.book_count = book.book_count <= 0 ? 0 : book.book_count - 1;
    if (book.book_count == 0) {
      book.book_available = false;
    }
    order.order_approved = true;
    // save updated info
    await order.save();
    await book.save();
    await order.destroy();

    const user = await req.models.User.findOne({
      where: { user_id: book.user_id },
    });

    let data = {
      owner: user.name,
      owner_contact: user.user_contact,
      owner_email: user.user_email,
      book_id: book.book_id,
      book_name: book.book_name,
      order_id: order.order_id,
    };

    await sendEmail(
      data,
      "You order is approved by the owner",
      order.email,
      "approve"
    );

    res.redirect(301, `${process.env.SERVER_HOST}:4000/cabinet`);
  } catch (error) {
    next(new InternalServerError(500, error.message));
  }
};

const REJECT_BUY = async (req, res, next) => {
  try {
    let order = undefined;
    try {
      order = await req.models.Order.findOne({
        where: { order_id: req.params.order_id },
      });
    } catch (error) {
      next(new ValidationError(400, error.message));
      return;
    }
    // checking
    if (!order) {
      next(new NotFoundError(404, "The order is not fount"));
      return;
    }
    // get book from db to send book info to the getter
    const book = await req.models.Book.findOne({
      where: { book_id: order.book_id },
    });
    // soft delete order from db
    await order.destroy();
    // send notification about rejecting the order
    await sendEmail(
      {
        order_id: order.order_id,
        book_id: book.book_id,
        book_name: book.book_name,
      },
      "Your order is rejected by the owner",
      order.email,
      "reject"
    );

    res.redirect(301, `${process.env.SERVER_HOST}:4000/cabinet`);
  } catch (error) {
    next(new InternalServerError(500, error.message));
  }
};

const RESTORE_BOOK = async (req, res, next) => {
  try {
    // get book from db
    let order = undefined;
    try {
      order = await req.models.Order.findOne({
        where: { order_id: req.params.order_id },
      });
    } catch (error) {
      next(new ValidationError(400, error.message));
      return;
    }
    // validation
    if (!order) {
      next(new NotFoundError(404, "The book is not fount"));
      return;
    }
    const book = await req.models.Book.findOne({
      where: { book_id: order.book_id },
    });

    // update book count and availability
    book.book_count += 1;
    if (!book.book_available) {
      book.book_available = true;
    }
    // save update
    await book.save();
    await order.destroy();

    res
      .status(200)
      .json({ status: 200, message: "Book info is updated", data: book });
  } catch (error) {
    next(new InternalServerError(500, error.message));
  }
};

export default {
  GET_ORDER,
  APPROVE_RENT,
  REJECT_RENT,
  APPROVE_BUY,
  REJECT_BUY,
  RESTORE_BOOK,
};
