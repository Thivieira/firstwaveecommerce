import blingStoreOrder from "../../services/blingStoreOrder";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const order = await blingStoreOrder(req.body.cart, req.body.user);
    if (!order) {
      res.status(500).json({
        error: "Server error!",
      });
      return false;
    }

    res.status(200).json({
      message: "Order saved successfully.",
    });
  }
}
