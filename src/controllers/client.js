const clientModel = require("../models/client");
const orderModel = require("../models/order");
const {
  formatResponse,
  convertQuery,
  convertUpdateBody,
} = require("../utils/helper");

var ObjectID = require("mongodb").ObjectID;

async function getClient(req, res) {
  const { clientId } = req.params;
  const client = await clientModel.findById(clientId);
  if (!client) {
    return formatResponse(res, "Client not found", 404);
  }
  return formatResponse(res, client);
}

async function addClient(req, res) {
  const { firstName, lastName, gender, mobile, email, postcode } = req.body;
  const client = new clientModel({
    firstName,
    lastName,
    gender,
    mobile,
    email,
    postcode,
  });
  await client.save();
  return formatResponse(res, client);
}

async function updateClient(req, res) {
  const { clientId } = req.params;
  const keys = [
    "firstName",
    "lastName",
    "gender",
    "mobile",
    "email",
    "postcode",
  ];

  const updateClient = await clientModel.updateOne(
    { _id: ObjectID(clientId) },
    { $set: convertUpdateBody(req.body, keys) }
  );

  if (!updateClient) {
    return formatResponse(res, "Client not found", 404);
  }

  return formatResponse(res, updateClient);
}

async function getClientOrders(req, res) {
  const { clientId } = req.params;
  const client = await clientModel.findById(clientId);
  if (!client) {
    return formatResponse(res, "Client not found", 404);
  }

  let search = {};
  if (req.query.status) {
    search = { status: req.query.status };
  }

  const pageNum = Number(req.query.page);
  const pageSize = Number(req.query.pageSize);
  const start = (pageNum - 1) * pageSize;

  const total = await orderModel
    .find({ postBy: ObjectID(clientId) })
    .find(search)
    .countDocuments()
    .exec();

  const { pagination, sort } = convertQuery(req.query, total);

  const orders = await orderModel
    .find({ postBy: ObjectID(clientId) })
    .find(search)
    .sort(sort)
    .skip(start)
    .limit(pageSize)
    .populate("postBy")
    .exec();

  return formatResponse(res, { data: orders, pagination });
}

module.exports = {
  getClient,
  addClient,
  updateClient,
  getClientOrders,
};
