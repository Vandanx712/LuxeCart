import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FiCheck, FiMinus, FiPlus, FiUpload, FiX } from 'react-icons/fi'

function AddProduct({ onclose }) {

    const [categories, setCategories] = useState([])
    const [subcategories, setSubCategories] = useState([])
    const [isLoadsubcategory, setIsSubcategory] = useState('')

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState('')
    const [discount, setDiscount] = useState('')
    const [brand, setBrand] = useState('')
    const [images, setImges] = useState([])
    const [imageUrl, setImageUrl] = useState([])
    const [variants, setVariant] = useState([
        {
            name: '',
            price: '',
            stock: '',
            defaultVariant: false,
            attributes: [{ key: '', value: '' }]
        }
    ])

    useEffect(() => {
        if (images.length === 0) {
            setImageUrl([]);
            return;
        }
        const newimageUrl = images.map(image => URL.createObjectURL(image))
        setImageUrl(newimageUrl)
    }, [images])

    useEffect(() => {
        loadCategory()
    }, [])

    const loadCategory = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/allcategory`)
            setCategories(response.data.categoies)
        } catch (error) {
            console.log(error)
        }
    }

    const loadsubcategory = async (categoryId) => {
        setIsSubcategory(categoryId)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/getsubcategory/${categoryId}`)
            setSubCategories(response.data.subcategory)
        } catch (error) {
            console.log(error)
        }
    }

    const addVariant = () => {
        setVariant([
            ...variants,
            { name: "", price: "", stock: "", defaultVariant: false, attributes: [{ key: "", value: "" }] }
        ]);
    };

    const addAttribute = (variantIndex) => {
        const updated = [...variants];
        updated[variantIndex].attributes.push({ key: "", value: "" });
        setVariant(updated);
    };

    const removeVariant = (variantIndex) => {
        const removedvariant = variants[variantIndex]
        setVariant(variants.filter((variant) => variant !== removedvariant))
    }

    const removeAttribute = (variantIndex) => {
        const updated = [...variants]
        updated[variantIndex].attributes.pop()
        setVariant(updated)
    }

    const removeimage = (index) => {
        setImges(prev => prev.filter((_, i) => i !== index));
    }

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
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl hidden md:block animate-bounce   ">
                                <FiPlus className="text-3xl" />
                            </div>
                            <div>
                                <h2 className="text-3xl text-nowrap font-semibold mb-1">Add New Product</h2>
                                <p className="text-lg opacity-90">Create a new product in your inventory</p>
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
                    <div className="p-8 space-y-6">
                        {/* Product Name */}
                        <div className=" group">
                            <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-royalpurple rounded-full"></span>
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                // value={formData.name}
                                // onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Premium Wireless Headphones"
                                className="w-full px-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium placeholder:text-warmgrey/60 shadow-sm focus:shadow-lg"
                            />
                        </div>

                        {/* Category */}
                        <div className="group">
                            <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-emeraldgreen rounded-full"></span>
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                onChange={(e) => { setCategory(e.target.value); loadsubcategory(e.target.value) }}
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: 'right 1rem center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '1.5em 1.5em'
                                }}
                                className="font-sans w-full px-5 py-4 bg-offwhite/50  rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium shadow-sm focus:shadow-lg appearance-none cursor-pointer"
                            >
                                <option value="">Select a category </option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>{category.name} </option>
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
                                onChange={(e) => setSubcategory(e.target.value)}
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: 'right 1rem center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '1.5em 1.5em'
                                }}
                                className="font-sans w-full px-5 py-4 bg-offwhite/50  rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium shadow-sm focus:shadow-lg appearance-none cursor-pointer"
                            >
                                {isLoadsubcategory ? (
                                    <>
                                        <option value="">Select a subcategory </option>
                                        {subcategories.map((scategory) => (
                                            <option key={scategory._id} value={scategory._id}>{scategory.name}</option>
                                        ))}
                                    </>
                                ) : <option>Plz Select Category</option>}
                            </select>
                        </div>

                        {/* variant & attribute */}

                        <div className=" group">
                            <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-royalpurple rounded-full"></span>
                                Product Variants <span className="text-red-500">*</span>
                            </label>
                            <div className="border border-gray-200 p-5 flex-col flex rounded-xl space-y-6 bg-offwhite">
                                {variants.map((variant, vIndex) => (
                                    <div key={vIndex} className='flex flex-col space-y-6'>
                                        <div className=" group">
                                            <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                                                Variant Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Variant Name"
                                                value={variant.name}
                                                onChange={(e) => handleVariantChange(vIndex, "name", e.target.value)}
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
                                                onChange={(e) => handleVariantChange(vIndex, "price", e.target.value)}
                                                className="w-full px-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium placeholder:text-warmgrey/60 shadow-sm focus:shadow-lg"
                                            />
                                        </div>

                                        <div className=" group">
                                            <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                                                Stock Quantity <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Stock"
                                                value={variant.stock}
                                                onChange={(e) => handleVariantChange(vIndex, "stock", e.target.value)}
                                                className="w-full px-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium placeholder:text-warmgrey/60 shadow-sm focus:shadow-lg"
                                            />
                                        </div>
                                        <div className="flex items-center space-x-3 p-3 relative">
                                            <input
                                                type="checkbox"
                                                checked={variant.defaultVariant}
                                                onChange={() => handleVariantChange(vIndex, "defaultVariant", !variant.defaultVariant)}
                                                className=" peer w-5 h-5 rounded border-2 border-gray-300 appearance-none checked:bg-royalpurple checked:border-royalpurple cursor-pointer transition-all"
                                            />
                                            <FiCheck
                                                className="absolute left-4 top-[18px] w-3 h-3 text-white opacity-0 pointer-events-none peer-checked:opacity-100 transition-opacity"
                                            />

                                            <label
                                                htmlFor='true'
                                                className="cursor-pointer"
                                            >
                                                Default Variant
                                            </label>
                                        </div>


                                        {/* Attribute List */}
                                        <label className=" text-sm font-medium text-CharcoalBlack mb-5 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-royalpurple rounded-full"></span>
                                            Product Attributes <span className="text-red-500">*</span>
                                        </label>
                                        <div className='border border-gray-200 p-5 flex-col flex rounded-xl space-y-6 bg-offwhite'>
                                            {variant.attributes.map((attr, aIndex) => (
                                                <div key={aIndex} className="flex flex-col space-y-3">
                                                    <div className=" group">
                                                        <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                                                            Attribute key<span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Attribute Key (e.g. Color)"
                                                            value={attr.key}
                                                            onChange={(e) => handleAttributeChange(vIndex, aIndex, "key", e.target.value)}
                                                            className="w-full px-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium placeholder:text-warmgrey/60 shadow-sm focus:shadow-lg"
                                                        />
                                                    </div>
                                                    <div className=" group">
                                                        <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                                                            Attribute Value<span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Value (e.g. White)"
                                                            value={attr.value}
                                                            onChange={(e) => handleAttributeChange(vIndex, aIndex, "value", e.target.value)}
                                                            className="w-full px-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium placeholder:text-warmgrey/60 shadow-sm focus:shadow-lg"
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => removeAttribute(vIndex)}
                                                className="flex-1 px-6 py-3 bg-red-400 text-white rounded-2xl font-bold hover:shadow-xl shadow-lg flex items-center justify-center gap-2"
                                            >
                                                <FiMinus className="text-xl" />
                                                Remove Attribute
                                            </button>
                                            <button
                                                onClick={() => addAttribute(vIndex)}
                                                className="flex-1 px-6 py-3 bg-blue-300 text-white rounded-2xl font-bold hover:shadow-xl shadow-lg flex items-center justify-center gap-2"
                                            >
                                                <FiPlus className="text-xl" />
                                                Add Attribute
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeVariant(vIndex)}
                                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold hover:shadow-xl shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <FiMinus className="text-xl" />
                                            Remove Variant
                                        </button>

                                    </div>
                                ))}


                                <button
                                    onClick={() => addVariant()}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:shadow-xl shadow-lg flex items-center justify-center gap-2"
                                >
                                    <FiPlus className="text-xl" />
                                    Add Variant
                                </button>
                            </div>
                        </div>

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
                                    // value={}
                                    // onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
                                <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gold font-bold text-lg">%</div>
                                <input
                                    type="number"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    placeholder="min 1 & max 90"
                                    className="w-full pl-10 pr-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-bold text-lg shadow-sm focus:shadow-lg placeholder:text-warm-grey/50"
                                />
                            </div>
                        </div>

                        {/* upload file */}
                        <div className=" group">
                            <label className=" text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-royalpurple rounded-full"></span>
                                Product Images (select multiple pics in once)  <span className="text-red-500">*</span>
                            </label>
                            <div className="border border-gray-200 p-5 flex-col flex rounded-xl space-y-6 bg-offwhite">
                                <input
                                    type='file'
                                    multiple accept='image/*'
                                    onChange={(e) => setImges([...e.target.files])}
                                    className="w-full px-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium placeholder:text-warmgrey/60 shadow-sm focus:shadow-lg"
                                />
                                <div className="flex flex-row flex-wrap gap-4">
                                    {imageUrl.map((image, index) => (
                                        <>
                                            <img key={index} className="w-20 h-20 object-cover rounded-lg" src={image} />
                                            <button
                                                onClick={() => removeimage(index)}
                                                className=" relative right-8 bottom-2 cursor-pointer outline-none flex justify-center w-5 h-5 items-center bg-red-600 text-white rounded-full font-bold "
                                            >
                                                <FiMinus />
                                            </button>
                                        </>
                                    ))}
                                </div>


                                <button
                                    // onClick={() => addVariant()}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:shadow-xl shadow-lg flex items-center justify-center gap-2"
                                >
                                    <FiUpload className="text-xl" />
                                    Upload Photos
                                </button>
                            </div>
                        </div>


                        {/* Description */}
                        <div className="group">
                            <label className="text-sm font-medium text-CharcoalBlack mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-warmgrey rounded-full"></span>
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Add a detailed description of your product..."
                                className="w-full px-5 py-4 bg-offwhite/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-100 hover:border-gray-200 transition-all duration-300 text-CharcoalBlack font-medium resize-none shadow-sm focus:shadow-lg placeholder:text-warmgrey/60"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-300">
                            <button
                                onClick={onclose}
                                className="flex-1 px-8 py-4 bg-surface-hover border-2 border-border text-CharcoalBlack rounded-2xl font-bold hover:bg-gray-700 hover:border-warmgrey/30 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
                            >
                                Cancel
                            </button>
                            <button className="flex-1 px-8 py-4 bg-blue-500 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2">
                                <FiPlus className="text-xl" />
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddProduct
