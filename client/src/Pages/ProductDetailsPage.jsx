import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import apiClient from '../lib/api';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const { quantities, handleQuantityChange } = useCart();

    useEffect(() => {
        apiClient.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!product) return <div className="text-center py-20 text-xl font-medium text-slate-600">Loading product details...</div>;

    return (
        <div className="py-12 px-4 sm:px-8 lg:px-24 min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto space-y-6">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all duration-200"
                >
                    ← Back
                </button>

                <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Product Image */}
                    <div className="w-full h-[550px] overflow-hidden flex justify-center items-center">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="object-contain w-full h-full rounded-xl"
                        />
                    </div>

                    {/* Product Details */}
                    <div className="space-y-5">
                        <h1 className="text-4xl font-extrabold text-gray-900">{product.name}</h1>
                        <p className="text-lg text-gray-700">{product.desc}</p>

                        <div className="grid grid-cols-2 gap-4 text-lg mt-4">
                            <p><span className="font-semibold">Price:</span> ₹{product.price}</p>
                            <p className="text-red-600 font-semibold">Discount: {product.discount_percent}%</p>
                            <p className="text-blue-700"><span className="font-semibold">Stock:</span> {product.stock}</p>
                        </div>

                        {/* Quantity Selector */}
                        <div className="mt-4">
                            <label className="block mb-2 text-lg font-medium">Quantity:</label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleQuantityChange(
                                        product._id,
                                        product.price,
                                        product.discount_percent,
                                        Math.max((quantities[product._id]?.quantity || 0) - 1, 0),
                                        product.stock
                                    )}
                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={product.stock === 0 || (quantities[product._id]?.quantity || 0) === 0}
                                    aria-label="Decrease quantity"
                                >
                                    -
                                </button>

                                <input
                                    type="number"
                                    min="0"
                                    max={product.stock}
                                    value={quantities[product._id]?.quantity || 0}
                                    onChange={(e) =>
                                        handleQuantityChange(
                                            product._id,
                                            product.price,
                                            product.discount_percent,
                                            e.target.value.replace(/\D/g, ""),
                                            product.stock
                                        )
                                    }
                                    className="w-20 px-3 py-1 border rounded text-center"
                                    disabled={product.stock === 0}
                                />

                                <button
                                    onClick={() => handleQuantityChange(
                                        product._id,
                                        product.price,
                                        product.discount_percent,
                                        Math.min((quantities[product._id]?.quantity || 0) + 1, product.stock),
                                        product.stock
                                    )}
                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={product.stock === 0 || (quantities[product._id]?.quantity || 0) >= product.stock}
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>

                            <p className="mt-4 text-xl font-bold">
                                Total: ₹{((quantities[product._id]?.quantity || 0) * product.price * (1 - product.discount_percent / 100)).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
