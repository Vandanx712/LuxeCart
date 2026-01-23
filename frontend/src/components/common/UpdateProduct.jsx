import axios from "axios";
import { useEffect, useState } from "react";
import {
  FiCheck,
  FiEdit,
  FiMinus,
  FiPlus,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";

function UpdateProduct({ onclose, id }) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [isLoadsubcategory, setIsSubcategory] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [discount, setDiscount] = useState("");
  const [brand, setBrand] = useState("");
  const [images, setImges] = useState([]);
  const [isimage, setIsImage] = useState([]);
  const [imageUrl, setImageUrl] = useState(false);
  const [productImage, setProductImage] = useState(null);
  const [variants, setVariant] = useState([
    {
      name: "",
      price: "",
      stock: "",
      defaultVariant: false,
      attributes: [{ key: "", value: "" }],
    },
  ]);
  const [uploading, setUploading] = useState(false);
  const [isUpload, setIsUpload] = useState(false);

  useEffect(() => {
    if (images.length === 0) {
      setImageUrl([]);
      return;
    }
    if (!isimage) {
      const newimageUrl = images.map((image) => URL.createObjectURL(image));
      setImageUrl(newimageUrl);
    }
  }, [images]);

  useEffect(() => {
    loadproduct();
    loadCategory();
  }, []);

  const loadproduct = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/getproductById/${id}`,
      );
      setName(response.data.product[0].name);
      setDescription(response.data.product[0].description);
      setCategory(response.data.product[0].category);
      loadsubcategory(response.data.product[0].category)
      setSubcategory(response.data.product[0].subcategory);
      setBrand(response.data.product[0].brand);
      setDiscount(response.data.product[0].discount);
      setVariant(response.data.product[0].variants);
      setImges(response.data.product[0].images);
      setIsImage(response.data.product[0].images.length > 0 ? true : false);
    } catch (error) {
      console.error(error);
    }
  };
  const loadCategory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/allcategory`,
      );
      setCategories(response.data.categoies);
    } catch (error) {
      console.log(error);
    }
  };

  const loadsubcategory = async (categoryId) => {
    setIsSubcategory(categoryId);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/product/getsubcategory/${categoryId}`,
      );
      setSubCategories(response.data.subcategory);
    } catch (error) {
      console.log(error);
    }
  };

  const addVariant = () => {
    setVariant([
      ...variants,
      {
        name: "",
        price: "",
        stock: "",
        defaultVariant: false,
        attributes: [{ key: "", value: "" }],
      },
    ]);
  };

  const addAttribute = (variantIndex) => {
    const updated = [...variants];
    updated[variantIndex].attributes.push({ key: "", value: "" });
    setVariant(updated);
  };

  const removeVariant = async(id,variantIndex) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/seller/deletevariant/${id}`,{withCredentials:true})
      const removedvariant = variants[variantIndex];
      setVariant(variants.filter((variant) => variant !== removedvariant));
    } catch (error) {
      console.error(error)
    }
  };

  const removeAttribute = (variantIndex) => {
    const updated = [...variants];
    updated[variantIndex].attributes.pop();
    setVariant(updated);
  };

  const removeimage = (index) => {
    setImges((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariant(updated);
  };

  const handleAttributeChange = (variantIndex, attrIndex, field, value) => {
    const updated = [...variants];
    updated[variantIndex].attributes[attrIndex][field] = value;
    setVariant(updated);
  };

  const uploadImge = async () => {
    if (images.length == 0) toast.error("Plz choose image");
    else {
      try {
        setUploading(true);
        const formdata = new FormData();
        for (let i = 0; i < images.length; i++) {
          formdata.append("avatar", images[i]);
        }
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/profilepic/uploadimages`,
          formdata,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          },
        );
        setProductImage(response.data?.productimages);
        toast.success(response.data?.message);
      } catch (error) {
        console.error(error);
      } finally {
        setUploading(false);
      }
    }
  };

  const setproductpics = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/changeproduct`,
        {
          productId: id,
          productImg: productImage,
        },
        { withCredentials: true },
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const updateproduct = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/`,
        {
          productId: id,
          name: name.trim(),
          description: description.trim(),
          brand: brand.trim(),
          category,
          subcategory,
          discount,
        },
        { withCredentials: true },
      );
      toast.success(response.data.message);
      onclose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message);
    }
  };

  const removeImage = async (index) => {
    try {
      const image = images[index];
      if (!image) return;

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/profilepic/delete`,
        {
          oldkey: image.key,
        },
        { withCredentials: true },
      );

      images[index] = {
        key: "",
        url: "",
      };
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/changeproduct`,
        {
          productId: id,
          productImg: images,
        },
        { withCredentials: true },
      );
      setImges(res.data.images);
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleReplaceImage = async (e, index) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);
      const formdata = new FormData();
      formdata.append("avatar", file);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/profilepic/uploadimages`,
        formdata,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );
      images[index] = {
        key: response.data?.productimages[0].key,
        url: response.data?.productimages[0].url,
      };

      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/changeproduct`,
        {
          productId: id,
          productImg: images,
        },
        { withCredentials: true },
      );
      setImges(res.data.images);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-CharcoalBlack/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
        // onClick={() => setIsAddProductOpen(false)}
      >
        <div
          className=" bg-offwhite rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar border border-gray-300 animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="lg:sticky top-0 bg-gradient-to-tr from-blue-500 to-royalpurple/50 text-white p-8 rounded-t-3xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hidden md:block animate-bounce">
                <FiPlus className="text-3xl" />
              </div>
              <div>
                <h2 className="text-3xl text-nowrap font-semibold mb-1">
                  Add New Product
                </h2>
                <p className="text-lg opacity-90">
                  Create a new product in your inventory
                </p>
              </div>
            </div>
            <button
              onClick={onclose}
              className="p-3 hover:bg-white/20 rounded-2xl transition-all duration-300 hover:rotate-90"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          {/* Modal Content */}
          {!isUpload && (
            <div className="p-8 space-y-6">
              {/* Product Name */}
              <div className=" group">
                <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-royalpurple rounded-full"></span>
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.trim())}
                  placeholder="e.g., Premium Wireless Headphones"
                  className="w-full px-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium placeholder:text-warmgrey/60 shadow-sm focus:shadow-lg"
                />
              </div>

              {/* Category & sub category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Category */}
                <div className="group">
                  <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emeraldgreen rounded-full"></span>
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      loadsubcategory(e.target.value);
                    }}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 1rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                    }}
                    className="font-sans w-full px-5 py-4 bg-offwhite/50  rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium shadow-sm focus:shadow-lg appearance-none cursor-pointer"
                  >
                    <option value="">Select a category </option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}{" "}
                      </option>
                    ))}
                  </select>
                </div>

                {/* sub category */}
                <div className="group">
                  <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emeraldgreen rounded-full"></span>
                    Sub Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 1rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                    }}
                    className="font-sans w-full px-5 py-4 bg-offwhite/50  rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium shadow-sm focus:shadow-lg appearance-none cursor-pointer"
                  >
                    {isLoadsubcategory ? (
                      <>
                        <option value="">Select a subcategory</option>
                        {subcategories.map((scategory) => (
                          <option key={scategory._id} value={scategory._id}>
                            {scategory.name}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option>Plz Select Category</option>
                    )}
                  </select>
                </div>
              </div>

              {/* variant & attribute */}

              <div className=" group">
                <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-royalpurple rounded-full"></span>
                  Product Variants <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-200 p-5 flex-col flex rounded-xl space-y-6 bg-offwhite">
                  {variants.map((variant, vIndex) => (
                    <div key={variant.id} className="flex flex-col space-y-6">
                      <div className=" flex items-center justify-between">
                        <span className="text-sm font-medium text-royalpurple">
                          Variant {vIndex + 1}
                        </span>
                        {variants.length > 1 && (
                          <button
                            onClick={() => removeVariant(variant.id,vIndex)}
                            className=" text-xs text-red-400 hover:text-red-600 flex items-center transition-colors gap-1"
                          >
                            <FiMinus className="text-xl" />
                            Remove Variant
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className=" group">
                          <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                            Variant Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Variant Name"
                            value={variant.variant_name}
                            onChange={(e) =>
                              handleVariantChange(
                                vIndex,
                                "name",
                                e.target.value.trim(),
                              )
                            }
                            className="w-full px-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium placeholder:text-warmgrey/60 shadow-sm focus:shadow-lg"
                          />
                        </div>
                        <div className=" group">
                          <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                            Price <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            placeholder="Price"
                            value={variant.price}
                            onChange={(e) =>
                              handleVariantChange(
                                vIndex,
                                "price",
                                e.target.value.trim(),
                              )
                            }
                            className="w-full px-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium placeholder:text-warmgrey/60 shadow-sm focus:shadow-lg"
                          />
                        </div>

                        <div className=" group">
                          <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                            Stock Quantity{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            placeholder="Stock"
                            value={variant.stock_count}
                            onChange={(e) =>
                              handleVariantChange(
                                vIndex,
                                "stock",
                                e.target.value.trim(),
                              )
                            }
                            className="w-full px-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium placeholder:text-warmgrey/60 shadow-sm focus:shadow-lg"
                          />
                        </div>
                      </div>

                      <label className="w-fit flex items-center gap-2.5 cursor-pointer">
                        <div className=" p-3 relative">
                          <input
                            type="checkbox"
                            checked={variant.is_default_Variant}
                            onChange={() =>
                              handleVariantChange(
                                vIndex,
                                "defaultVariant",
                                !variant.is_default_Variant,
                              )
                            }
                            className=" peer w-5 h-5 rounded border-2 border-gray-300 appearance-none checked:bg-royalpurple checked:border-royalpurple cursor-pointer transition-all"
                          />
                          <FiCheck className="absolute left-4 top-[17px] w-3 h-3 text-white opacity-0 pointer-events-none peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <span className="cursor-pointer">
                          Set as Default Variant
                        </span>
                      </label>

                      {/* Attribute List */}
                      <div className=" bg-offwhite border border-warmgrey/20 rounded-lg p-4 space-x-3">
                        <label className=" text-sm font-medium text-CharcoalBlack mb-5 flex items-center gap-2">
                          <span className="w-2 h-2 bg-royalpurple rounded-full"></span>
                          Product Attributes{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="border border-gray-200 p-5 flex-col flex rounded-xl space-y-6 bg-offwhite">
                          {variant.attributes.map((attr, aIndex) => (
                            <div
                              key={aIndex}
                              className="grid grid-cols-2 gap-3"
                            >
                              <div className=" group">
                                <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                                  Attribute key
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="Attribute Key (e.g. Color)"
                                  value={attr.key}
                                  onChange={(e) =>
                                    handleAttributeChange(
                                      vIndex,
                                      aIndex,
                                      "key",
                                      e.target.value.trim(),
                                    )
                                  }
                                  className="w-full px-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium placeholder:text-warmgrey/60 shadow-sm focus:shadow-lg"
                                />
                              </div>
                              <div className=" group">
                                <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                                  Attribute Value
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="Value (e.g. White)"
                                  value={attr.value}
                                  onChange={(e) =>
                                    handleAttributeChange(
                                      vIndex,
                                      aIndex,
                                      "value",
                                      e.target.value.trim(),
                                    )
                                  }
                                  className="w-full px-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium placeholder:text-warmgrey/60 shadow-sm focus:shadow-lg"
                                />
                              </div>
                            </div>
                          ))}
                          <div className=" flex gap-2 pt-2">
                            <button
                              onClick={() => addAttribute(vIndex)}
                              className="flex-1 p-3 bg-emeraldgreen/10 text-emeraldgreen boder border-emeraldgreen/20 hover:bg-emeraldgreen/20 rounded-lg font-medium hover:shadow-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-1.5"
                            >
                              <FiPlus className="text-xl" />
                              Add Attribute
                            </button>
                            {variant.attributes.length > 1 && (
                              <button
                                onClick={() => removeAttribute(vIndex)}
                                className="flex-1 p-3 bg-red-100 text-red-500 rounded-lg font-medium hover:bg-red-200 shadow-lg transition-all duration-200  flex items-center justify-center gap-1.5"
                              >
                                <FiMinus className="text-xl" />
                                Remove Attribute
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => addVariant()}
                    className="w-full p-3.5 bg-royalpurple/10 text-royalpurple hover:bg-royalpurple/20 border border-royalpurple/20 rounded-xl transition-all duration-200  text-sm font-semibold hover:shadow-xl shadow-lg  flex items-center justify-center gap-2"
                  >
                    <FiPlus className="text-xl" />
                    Add Variant
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* brand */}
                <div className="group">
                  <label className="text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gold rounded-full"></span>
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gold font-bold text-lg"></div>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value.trim())}
                      placeholder="e.g.,Samsung"
                      className="w-full pl-10 pr-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-bold text-lg shadow-sm focus:shadow-lg placeholder:text-warm-grey/50"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gold rounded-full"></span>
                    Discount<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gold font-bold text-lg">
                      %
                    </div>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value.trim())}
                      placeholder="min 1 & max 90"
                      className="w-full pl-10 pr-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-bold text-lg shadow-sm focus:shadow-lg placeholder:text-warm-grey/50"
                    />
                  </div>
                </div>
              </div>

              {/* upload file */}

              {!isimage && (
                <div className=" group">
                  <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-royalpurple rounded-full"></span>
                    Product Images (select multiple pics in once)
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-200 p-5 flex-col flex rounded-xl space-y-6 bg-offwhite">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setImges([...e.target.files])}
                      className="w-full px-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium placeholder:text-warmgrey/60 shadow-sm focus:shadow-lg"
                    />

                    <div className="flex flex-row flex-wrap gap-3 pt-2">
                      {imageUrl.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            key={index}
                            className="w-20 h-20 object-cover rounded-lg"
                            src={image}
                          />
                          <button
                            onClick={() => removeimage(index)}
                            className=" absolute -top-2 -right-2 cursor-pointer outline-none flex justify-center w-5 h-5 items-center bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 "
                          >
                            <FiX className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => uploadImge()}
                        className="flex-1 p-3 bg-blue-100 hover:bg-blue-200 text-blue-500 rounded-xl font-semibold hover:shadow-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <FiUpload className="text-xl" />
                        Upload Photos
                      </button>
                      <button
                        onClick={() => setproductpics()}
                        className="flex-1 p-3 bg-deep-navy-dark/30 hover:bg-deep-navy-dark/60 hover:text-DeepNavy text-DeepNavy/60 rounded-xl font-semibold hover:shadow-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <FiUpload className="text-xl" />
                        Update Photos
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isimage && (
                <div className=" group">
                  <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-royalpurple rounded-full"></span>
                    Product Images ( manage product images )
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-200 p-5 flex-col flex rounded-xl space-y-6 bg-offwhite">
                    <div className="flex flex-row flex-wrap gap-3 pt-2">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className="relative w-20 h-20 border rounded-lg flex items-center justify-center bg-gray-100 cursor-pointer group"
                        >
                          {image.url !== "" ? (
                            <>
                              <img
                                src={image.url}
                                className="w-full h-full object-cover rounded-lg"
                              />

                              <button
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center cursor-pointer"
                              >
                                <FiX className="text-xs" />
                              </button>
                            </>
                          ) : (
                            <label className="flex flex-col items-center justify-center text-xs text-gray-500 cursor-pointer">
                              <FiUpload className="text-lg" />
                              Add Image
                              <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => handleReplaceImage(e, index)}
                              />
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="group">
                <label className="text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-warmgrey rounded-full"></span>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Add a detailed description of your product..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value.trim())}
                  className="w-full px-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium resize-none shadow-sm focus:shadow-lg placeholder:text-warmgrey/60"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-row gap-3 pt-4 border-t border-gray-300">
                <button
                  onClick={onclose}
                  className="flex-1 px-4 py-3 bg-warmgrey/10 text-gray-500 border border-warmgrey/10 rounded-xl font-bold hover:bg-warmgrey/20 hover:border-warmgrey/20 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateproduct()}
                  className="flex-1 px-4 py-3 bg-blue-300 text-blue-500 rounded-2xl font-bold hover:shadow-xl hover:opacity-80  hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                >
                  <FiEdit className="text-xl" />
                  Update Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
      {uploading && (
        <div className="flex fixed bg-black/10 z-50 inset-0 flex-col justify-center items-center gap-2 mt-2">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-sm text-gray-500">uploading...</p>
        </div>
      )}
    </>
  );
}

export default UpdateProduct;
