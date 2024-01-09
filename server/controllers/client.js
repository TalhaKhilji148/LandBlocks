import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import getCountryIso3 from "country-iso-2-to-3";
import Property from "../models/Property.js"
// import User from "../models/User.js";
export const getProperties = async (req, res) => {
  try {
    // console.log("1122");
    const featuredProperties = await Property.find().populate(
      "currentOwner",
      "-password"
    );
    // console.log(featuredProperties);
    return res.status(200).json(featuredProperties);
  } catch (error) {
    return res.status(500).json(error);
  }
};
export const updateFeatured =  async (req, res) => {
   console.log("1111111111111111111");
   try {
     const property = await Property.findById(req.params.id); // Use req.params.id to get the property ID from URL params
     console.log("Entered", property);
     if (!property) {
       return res.status(404).json({ error: "Property not found" });
     }

     console.log("backend 22222222222222222222", property);

     // Toggle the 'featured' property
     property.featured = !property.featured;

     // Save the updated property
     const updatedProperty = await property.save();
     console.log("backend 333333333333333", updatedProperty);

     return res.status(200).json(updatedProperty);
   } catch (error) {
     console.log("Error:", error);
     return res.status(500).json(error);
   }
};
export const getUsers = async (req, res) => {
  try {
    // console.log("1122");
    const Users = await User.find();
    // console.log(featuredProperties);
    return res.status(200).json(Users);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return {
          ...product._doc,
          stat,
        };
      })
    );

    res.status(200).json(productsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    // sort should look like this: { "field": "userId", "sort": "desc"}
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments({
      name: { $regex: search, $options: "i" },
    });

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGeography = async (req, res) => {
  try {
    const users = await User.find();

    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
