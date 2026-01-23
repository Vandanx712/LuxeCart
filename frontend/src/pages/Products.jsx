import React, { useState, useEffect } from "react";
import ProductCard from "../components/common/ProductCard";
import {
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiFilter,
  FiX,
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";

function Products() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedDiscount, setSelectedDiscount] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [categories, setCategory] = useState([]);
  const [subcategories, setSubCategory] = useState([]);
  const [brands, setBrand] = useState([]);
  const [totalbrand, setTotalBrand] = useState(0);
  const [totalproduct, setTotalProduct] = useState(0);
  const [bpage, setBpage] = useState(1);
  const [page, setPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    subcategory: true,
    brand: true,
    // discount: true
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearFilters = () => {
    setIsSidebarOpen(false);
    setSelectedCategory("all");
    setSelectedSubCategory("all");
    setSelectedBrand("all");
    setSelectedDiscount("all");
    loadproduct();
  };
  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedSubCategory !== "all" ||
    selectedBrand !== "all" ||
    selectedDiscount !== "all";

  useEffect(() => {
    window.scrollTo(0, 0);
    loadcategory();
    loadproduct();
    loadbrand();
  }, []);

  const loadcategory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/allcategory`,
      );
      const categorys = response.data.categoies.map((cat) => {
        const catid = cat._id;
        const catname = cat.name;

        return { catid, catname };
      });

      setCategory(categorys);
    } catch (error) {
      console.log(error);
    }
  };
  const loadsubcategory = async (categoryId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/getsubcategory/${categoryId}`,
      );
      const subcategorys = response.data.subcategory.map((sub) => {
        const scatid = sub._id;
        const scatname = sub.name;
        return { scatid, scatname };
      });
      setSubCategory(subcategorys);
    } catch (error) {
      console.log(error);
    }
  };

  const loadbrand = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/allbrand`,
      );
      setBrand(response.data.brands);
      setTotalBrand(response.data.totalbrands);
    } catch (error) {
      console.log(error);
    }
  };

  const loadmorebrand = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/allbrand?page=${bpage + 1}`,
      );
      response.data.brands.map((b) => (b !== null ? brands.push(b) : ""));
      setBpage(response.data.page);
      setTotalBrand(response.data.totalbrands);
    } catch (error) {
      console.log(error);
    }
  };
  const loadproduct = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/allproducts`,
      );
      setFilteredProducts(response.data.products);
      setTotalProduct(response.data.totalproducts);
      setPage(response.data.page);
    } catch (error) {
      console.log(error);
    }
  };

  const loadmoreproduct = async () => {
    if (hasActiveFilters && filteredProducts.length > 5) {
      const filter =
        selectedSubCategory !== "all"
          ? selectedSubCategory
          : selectedCategory !== "all"
            ? selectedCategory
            : selectedBrand !== "all"
              ? selectedBrand
              : "";
      if (filter.length !== 0) {
        productFilter(filter);
      }
    } else if (!hasActiveFilters) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/allproducts?page=${page + 1}`,
        );
        response.data.products.map((p) => filteredProducts.push(p));
        setPage(response.data.page);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const productFilter = async (categoryId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/searchby/${categoryId}`,
      );
      setFilteredProducts(response.data.products);
      setTotalProduct(response.data.totalproducts);
      setPage(response.data.page);
    } catch (error) {
      console.log(error);
    }
  };

  const filetByBrand = async (brand) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/search?statement=${brand}`,
      );
      setFilteredProducts(response.data.products);
      setTotalProduct(response.data.totalproducts);
      setPage(response.data.page);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setIsSidebarOpen(false);
    setSelectedBrand("all");
    if (selectedCategory == categoryId) {
      setSelectedCategory("all");
      setSelectedSubCategory("all");
      loadproduct();
    } else {
      setSelectedCategory(categoryId);
      loadsubcategory(categoryId);
      productFilter(categoryId);
    }
  };

  const handleSubCategoryClick = (subcategoryId) => {
    setIsSidebarOpen(false);
    if (selectedSubCategory == subcategoryId) {
      setSelectedSubCategory("all");
      productFilter(selectedCategory);
    } else {
      setSelectedSubCategory(subcategoryId);
      productFilter(subcategoryId);
    }
  };

  const handleBrandClick = (brand) => {
    setSelectedSubCategory("all");
    setSelectedCategory("all");
    setIsSidebarOpen(false);
    if (selectedBrand == brand) {
      setSelectedBrand("all");
      loadproduct();
    } else {
      setSelectedBrand(brand);
      filetByBrand(brand);
    }
  };

  return (
    <div className=" mt-24">
      <div className="min-h-screen bg-offwhite font-Manrope">
        {/* Main Content with Sidebar Layout */}
        <div className="flex">
          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`
          fixed xl:sticky top-0 left-0 h-screen xl:h-auto w-80 xl:w-72 
          bg-white shadow-md xl:shadow-none border-r border-warmgrey/20 
          transform transition-transform duration-300 z-50 xl:z-auto xl:transform-none
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}
          overflow-y-auto
        `}
          >
            {/* Header */}
            <div className="p-4 border-b border-warmgrey/20 flex items-center justify-between">
              <h3 className="font-Playfair text-xl md:text-2xl font-semibold text-DeepNavy">
                Filters
              </h3>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-royalpurple text-[17px] font-Manrope hover:text-DeepNavy transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="xl:hidden p-1 hover:bg-warmgrey/10 rounded-md transition-colors"
                >
                  <FiX className="h-5 w-5 text-warmgrey" />
                </button>
              </div>
            </div>

            {/* Filter Sections */}
            <div className="p-4 space-y-6">
              {/* Category Filter */}
              <div className="space-y-3">
                <button
                  onClick={() => toggleSection("category")}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h4 className="font-sans text-DeepNavy text-xl">Category</h4>
                  {expandedSections.category ? (
                    <FiChevronUp className="h-4 w-4 text-warmgrey" />
                  ) : (
                    <FiChevronDown className="h-4 w-4 text-warmgrey" />
                  )}
                </button>

                {expandedSections.category && (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category.catid}
                        className="flex items-center cursor-pointer space-x-3 group"
                        onClick={() => handleCategoryClick(category.catid)}
                      >
                        <div
                          className={`w-4 h-4 rounded-sm text-royalpurple border border-warmgrey focus:ring-royalpurple ${selectedCategory !== "all" && selectedCategory == category.catid ? "bg-gray-500" : ""}`}
                        >
                          <FiCheck
                            size={15}
                            className={`text-white ${selectedCategory !== "all" && selectedCategory == category.catid ? "block" : "hidden"}`}
                          />
                        </div>
                        <span
                          className={`text-[15px] font-Manrope group-hover:text-royalpurple transition-colors ${selectedCategory !== "all" && selectedCategory == category.catid ? "text-royalpurple" : "text-gray-500"}`}
                        >
                          {category.catname}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Discount Filter */}
              {selectedCategory !== "all" && (
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection("discount")}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h4 className="font-sans text-xl  text-DeepNavy">
                      Sub-Category
                    </h4>
                    {expandedSections.discount ? (
                      <FiChevronUp className="h-4 w-4 text-warmgrey" />
                    ) : (
                      <FiChevronDown className="h-4 w-4 text-warmgrey" />
                    )}
                  </button>

                  {expandedSections.subcategory && (
                    <div className="space-y-2 ">
                      {subcategories.map((subcategory) => (
                        <div
                          key={subcategory.scatid}
                          className="flex items-center cursor-pointer space-x-3 group"
                          onClick={() =>
                            handleSubCategoryClick(subcategory.scatid)
                          }
                        >
                          <div
                            className={`w-4 h-4 rounded-sm text-royalpurple border border-warmgrey focus:ring-royalpurple ${selectedSubCategory !== "all" && selectedSubCategory == subcategory.scatid ? "bg-gray-500" : ""}`}
                          >
                            <FiCheck
                              size={15}
                              className={`text-white ${selectedSubCategory !== "all" && selectedSubCategory == subcategory.scatid ? "block" : "hidden"}`}
                            />
                          </div>
                          <span
                            className={`text-[15px] font-Manrope group-hover:text-royalpurple transition-colors ${selectedSubCategory !== "all" && selectedSubCategory == subcategory.scatid ? "text-royalpurple" : "text-gray-500"}`}
                          >
                            {subcategory.scatname}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Brand Filter */}
              <div className="space-y-3">
                <button
                  onClick={() => toggleSection("brand")}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h4 className="font-sans text-xl text-DeepNavy">Brand</h4>
                  {expandedSections.brand ? (
                    <FiChevronUp className="h-4 w-4 text-warmgrey" />
                  ) : (
                    <FiChevronDown className="h-4 w-4 text-warmgrey" />
                  )}
                </button>

                {expandedSections.brand && (
                  <div className="space-y-2 ">
                    {brands.map((brand) => (
                      <div
                        key={brand}
                        className="flex items-center cursor-pointer space-x-3 group"
                        onClick={() => handleBrandClick(brand)}
                      >
                        <div
                          className={`w-4 h-4 rounded-sm text-royalpurple border border-warmgrey focus:ring-royalpurple ${selectedBrand !== "all" && selectedBrand == brand ? "bg-gray-500" : ""}`}
                        >
                          <FiCheck
                            size={15}
                            className={`text-white ${selectedBrand !== "all" && selectedBrand == brand ? "block" : "hidden"}`}
                          />
                        </div>
                        <span
                          className={`text-[15px] font-Manrope group-hover:text-royalpurple transition-colors ${selectedBrand !== "all" && selectedBrand == brand ? "text-royalpurple" : "text-gray-500"}`}
                        >
                          {brand}
                        </span>
                      </div>
                    ))}
                    <button
                      className={` text-gold text-sm font-Manrope hover:text-royalpurple transition-all duration-300 transform hover:scale-105 ${totalbrand < 0 ? "hidden" : "block"}`}
                      onClick={loadmorebrand}
                    >
                      {totalbrand} More
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Product Area */}
          <div className="flex-1 min-h-screen">
            {/* Product Header */}
            <div className="bg-white border-b border-warmgrey/20 p-4 sticky top-0 z-30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="xl:hidden flex items-center gap-2 px-3 py-2 border border-warmgrey/30 rounded-md text-DeepNavy hover:bg-warmgrey/5 transition-colors"
                  >
                    <FiFilter className="h-4 w-4" />
                    <span className="font-Manrope text-sm">Filters</span>
                  </button>

                  <div className="flex items-baseline gap-4">
                    <h2 className="font-Playfair text-xl md:text-2xl font-semibold text-DeepNavy">
                      Products
                    </h2>
                    <span className="text-warmgrey font-Manrope text-sm">
                      ({totalproduct} Products)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="p-4 xl:p-6">
              {filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-7 xl:gap-10">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product._id} {...product} />
                    ))}
                  </div>

                  {/* Load More Button */}
                  <div className="text-center mt-12">
                    <button
                      onClick={() => loadmoreproduct()}
                      className="bg-DeepNavy text-offwhite px-12 py-4 rounded-full font-Manrope hover:bg-gold hover:text-CharcoalBlack transition-all duration-300 transform hover:scale-105"
                    >
                      Load More Products
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 bg-warmgrey/20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-warmgrey"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.22 0-4.239.881-5.71 2.291"
                        />
                      </svg>
                    </div>
                    <h3 className="font-Playfair text-2xl font-semibold text-DeepNavy mb-4">
                      No products found
                    </h3>
                    <p className="text-warmgrey font-Manrope mb-6">
                      We couldn't find any products matching your current
                      filters. Try adjusting your search criteria.
                    </p>
                    <button
                      onClick={clearFilters}
                      className="bg-gold text-CharcoalBlack px-8 py-3 rounded-full font-Manrope font-semibold hover:bg-gold/90 transition-colors duration-300"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default Products;
