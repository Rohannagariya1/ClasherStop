const Product = require("../models/productModel");
//create product
const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("../middleware/catchAsyncError"); 
const ApiFeatures = require("../utils/apifeatures");


//create product --> admin


exports.createProduct = catchAsyncError(async (req, res, next) => {
  
    req.body.user = req.user.id;
  
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
        
    });

});

//get all product
exports.getAllProducts = catchAsyncError(async (req, res) => {
    
    
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();
    const apifeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage);
    const products = await apifeatures.query;
    res.status(200).json({
        success: true,
        products
    });

});
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        product
        

    });


});




 
//update product
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true, runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        product
    });
});
//delete product
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }
    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: "product deleted sucessfully"
    });


});
//create new review or update the review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
      avg += rev.rating;
  });
    
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});
// get all reviews of a product
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) {
        return next(new ErrorHander("Product Not Found", 404));
    }
    res.status(200).json({
        success: true,
        reviews:product.reviews,        
    });
    


});
exports.deleteReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productid);
    if (!product) {
        return next(new ErrorHander("Product not found", 400));
    }
    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString()); 
    let avg = 0;

    reviews.forEach((rev) => {
       avg += rev.rating;
    });
    
    const ratings = avg / reviews.length;
    const numOfReviews = reviews.length;
    await Product.findByIdAndUpdate(req.query.productid, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
    });

});