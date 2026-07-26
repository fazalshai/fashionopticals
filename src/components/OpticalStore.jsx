import React, { useState } from 'react';
import { OPTICAL_PRODUCTS } from '../data/mockData';
import { Glasses, Filter, ShoppingBag, Eye, CheckCircle2, MessageSquare, PhoneCall } from 'lucide-react';

export const OpticalStore = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categories = ['All', 'Eyeglasses', 'Sunglasses', 'Blue-Light Glasses', 'Contact Lenses', 'Lens Options'];

  const filteredProducts = activeCategory === 'All' 
    ? OPTICAL_PRODUCTS 
    : OPTICAL_PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <section id="opticals" className="optical-store-section section-padding">
      <div className="container">
        
        <div className="section-title-wrap">
          <div className="badge badge-gold">
            <Glasses size={14} />
            <span>Fashion Opticals Boutique</span>
          </div>
          <h2>Find Your Perfect Pair & Prescription Eyewear</h2>
          <p>Explore designer frames, blue-light computer glasses, polarized sunglasses & contact lenses customized with your doctor prescription.</p>
        </div>

        {/* Store Highlight Banner */}
        <div className="store-banner-card glass-card dark-glass">
          <div className="banner-content">
            <div className="badge badge-blue mb-2">Prescription Frame Fitting Available</div>
            <h3>Got an Eye Test Prescription from Dr. Sekhar?</h3>
            <p>Get your lenses crafted with high-index anti-reflective coating, progressive transition digital technology, and ultra-light frames right here at Fashion Opticals desk.</p>
          </div>
          <div className="banner-img-wrap">
            <img src="/store.png" alt="Fashion Opticals Display" className="banner-img" />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="categories-tab-bar">
          <div className="tab-label">
            <Filter size={15} />
            <span>Categories:</span>
          </div>
          <div className="tabs-flex">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card glass-card">
              <div className="product-img-wrap">
                <img src={product.image} alt={product.name} className="product-img" />
                {product.badge && (
                  <span className="product-badge">{product.badge}</span>
                )}
                <button 
                  className="quick-view-btn"
                  onClick={() => setSelectedProduct(product)}
                >
                  <Eye size={15} /> Quick View
                </button>
              </div>

              <div className="product-info">
                <div className="product-cat-gender">
                  <span>{product.category}</span> • <span>{product.gender}</span>
                </div>
                <h3 className="product-title">{product.name}</h3>
                
                <div className="product-colors">
                  {product.colors.map((c, i) => (
                    <span key={i} className="color-swatch-tag">{c}</span>
                  ))}
                </div>

                <div className="product-footer">
                  <div className="product-price-box">
                    <span className="current-price">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && (
                      <span className="original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>

                  <button 
                    onClick={() => setSelectedProduct(product)} 
                    className="btn btn-primary btn-sm"
                  >
                    <ShoppingBag size={14} /> Reserve in Store
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Product Modal */}
        {selectedProduct && (
          <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="modal-content glass-card animate-fade-in product-modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedProduct(null)}>×</button>

              <div className="product-modal-grid">
                <div className="product-modal-img-wrap">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="modal-prod-img" />
                </div>

                <div className="product-modal-details">
                  <span className="badge badge-gold mb-2">{selectedProduct.badge || selectedProduct.category}</span>
                  <h2>{selectedProduct.name}</h2>
                  <p className="modal-prod-desc">{selectedProduct.description}</p>

                  <div className="price-tag-large">
                    <span className="price-val">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                    {selectedProduct.originalPrice && (
                      <span className="orig-val">M.R.P: ₹{selectedProduct.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>

                  <div className="modal-specs">
                    <div className="spec-item">
                      <CheckCircle2 size={16} className="text-blue" />
                      <span>Free Prescription Fitting with Clinic Consultation</span>
                    </div>
                    <div className="spec-item">
                      <CheckCircle2 size={16} className="text-blue" />
                      <span>1-Year Manufacturer Warranty on Frame & Anti-Scratch Lenses</span>
                    </div>
                    <div className="spec-item">
                      <CheckCircle2 size={16} className="text-blue" />
                      <span>Available Colors: {selectedProduct.colors.join(', ')}</span>
                    </div>
                  </div>

                  <div className="modal-reserve-actions">
                    <a
                      href={`https://wa.me/918512830995?text=Hello%20Fashion%20Opticals,%20I%20am%20interested%20in%20reserving/inquiring%20about%20the%20frame:%20${encodeURIComponent(selectedProduct.name)}%20(Price:%20Rs.${selectedProduct.price}).`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-gold btn-lg w-full"
                      style={{ background: '#16a34a' }}
                    >
                      <MessageSquare size={18} /> Inquire via WhatsApp
                    </a>

                    <a href="tel:+918512830995" className="btn btn-secondary btn-lg w-full">
                      <PhoneCall size={18} /> Call Store Desk (+91 8512830995)
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .optical-store-section {
          background: #ffffff;
        }
        .store-banner-card {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 2rem;
          padding: 2.5rem;
          margin-bottom: 3rem;
          align-items: center;
        }
        .banner-content h3 {
          font-size: 1.8rem;
          color: #ffffff;
          margin-bottom: 0.75rem;
        }
        .banner-content p {
          color: #cbd5e1;
          font-size: 1rem;
          line-height: 1.6;
        }
        .banner-img-wrap {
          height: 200px;
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .categories-tab-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2.5rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }
        .tab-label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 700;
          color: var(--primary-navy);
          font-size: 0.9rem;
          white-space: nowrap;
        }
        .tabs-flex {
          display: flex;
          gap: 0.6rem;
        }
        .tab-btn {
          background: #f8fafc;
          border: 1px solid var(--border-light);
          padding: 0.5rem 1.1rem;
          border-radius: var(--radius-full);
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-dark);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .tab-btn:hover { background: #e2e8f0; }
        .tab-btn.active {
          background: var(--primary-navy);
          color: #ffffff;
          border-color: var(--primary-navy);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .product-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border-light);
          transition: all 0.25s ease;
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--accent-blue);
        }
        .product-img-wrap {
          position: relative;
          height: 220px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #f8fafc;
          margin-bottom: 1rem;
        }
        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .product-card:hover .product-img {
          transform: scale(1.05);
        }
        .product-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: var(--primary-navy);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-sm);
        }
        .quick-view-btn {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          box-shadow: var(--shadow-sm);
        }

        .product-cat-gender {
          font-size: 0.75rem;
          color: var(--accent-blue);
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.2rem;
        }
        .product-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--primary-navy);
          margin-bottom: 0.5rem;
        }
        .product-colors {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 1rem;
        }
        .color-swatch-tag {
          font-size: 0.7rem;
          background: #f1f5f9;
          color: var(--text-muted);
          padding: 0.2rem 0.45rem;
          border-radius: var(--radius-sm);
        }
        .product-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 0.85rem;
          border-top: 1px solid var(--border-light);
        }
        .current-price {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--primary-navy);
        }
        .original-price {
          font-size: 0.82rem;
          color: var(--text-muted);
          text-decoration: line-through;
          margin-left: 0.4rem;
        }

        /* Product Modal */
        .product-modal-content {
          max-width: 800px;
        }
        .product-modal-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2rem;
          align-items: center;
        }
        .product-modal-img-wrap {
          height: 320px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #f8fafc;
        }
        .modal-prod-img { width: 100%; height: 100%; object-fit: cover; }
        .modal-prod-desc { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.25rem; }
        .price-tag-large { margin-bottom: 1.25rem; }
        .price-val { font-size: 1.8rem; font-weight: 800; color: var(--primary-navy); margin-right: 0.75rem; }
        .orig-val { font-size: 1rem; color: var(--text-muted); text-decoration: line-through; }
        .modal-specs { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem; }
        .spec-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; color: var(--text-dark); }
        .modal-reserve-actions { display: flex; flex-direction: column; gap: 0.75rem; }

        @media (max-width: 992px) {
          .store-banner-card { grid-template-columns: 1fr; }
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          .product-modal-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .products-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
};
