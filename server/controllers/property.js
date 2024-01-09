// import Property from "../models/Property";
// // import Product from "../models/Product.js";
// // export const getProducts = async (req, res) => {
// //   try {
// //     const products = await Product.find();

// //     const productsWithStats = await Promise.all(
// //       products.map(async (product) => {
// //         const stat = await ProductStat.find({
// //           productId: product._id,
// //         });
// //         return {
// //           ...product._doc,
// //           stat,
// //         };
// //       })
// //     );

// //     res.status(200).json(productsWithStats);
// //   } catch (error) {
// //     res.status(404).json({ message: error.message });
// //   }
// // };
// export const getProperties = async (req, res) => {
//   try {
//     // console.log("1122");
//     const featuredProperties = await Property.find({ featured: true }).populate(
//       "currentOwner",
//       "-password"
//     );
//     // console.log(featuredProperties);
//     return res.status(200).json(featuredProperties);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };
