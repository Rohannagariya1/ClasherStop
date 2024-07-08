class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
   }
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",
                

            },
        } : {
            
        };
    
        this.query = this.query.find({ ...keyword });
        return this;
    }
    filter() {
        const queryCopy = { ...this.queryStr }//javascript me jyadatar pass by refrence hota to avoid confusion aise kia ye pass by refrence ni hoga
        
        //removing field for category
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(key => delete queryCopy[key])
    // price ke lie naya banana padega kuki apan ko range me filter krna
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${ key }`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
   
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
    // database has 50 products so 5 pages    
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
   }
};

module.exports = ApiFeatures;