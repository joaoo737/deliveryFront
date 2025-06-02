import React, { useState, useEffect } from 'react';
import { api } from '../../../services/httpClient';
import { API_ENDPOINTS, UPLOAD } from '../../../utils/constants';
import { LoadingButton } from '../../common/Loading/Loading';
import './ProductForm.css';

const ProductForm = ({ 
  produto, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoriaId: '',
    disponivel: true,
    imagem: null,
    imagemUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    if (produto) {
      setFormData({
        nome: produto.nome || '',
        descricao: produto.descricao || '',
        preco: produto.preco?.toString() || '',
        categoriaId: produto.categoriaId?.toString() || '',
        disponivel: produto.disponivel ?? true,
        imagemUrl: produto.imagemUrl || ''
      });
      setPreviewUrl(produto.imagemUrl || '');
    }
    loadCategorias();
  }, [produto]);

  const loadCategorias = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PUBLICO.CATEGORIAS);
      setCategorias(response);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        imagem: 'Formato de imagem não suportado'
      }));
      return;
    }

    if (file.size > UPLOAD.MAX_FILE_SIZE) {
      setErrors(prev => ({
        ...prev,
        imagem: 'Imagem muito grande. Máximo 10MB'
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      imagem: file
    }));
    setPreviewUrl(URL.createObjectURL(file));
    setErrors(prev => ({
      ...prev,
      imagem: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.preco) {
      newErrors.preco = 'Preço é obrigatório';
    } else if (isNaN(formData.preco) || parseFloat(formData.preco) <= 0) {
      newErrors.preco = 'Preço deve ser maior que zero';
    }

    if (!formData.categoriaId) {
      newErrors.categoriaId = 'Categoria é obrigatória';
    }

    if (!produto && !formData.imagem && !formData.imagemUrl) {
      newErrors.imagem = 'Imagem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append('nome', formData.nome.trim());
      submitData.append('descricao', formData.descricao.trim());
      submitData.append('preco', formData.preco);
      submitData.append('categoriaId', formData.categoriaId);
      submitData.append('disponivel', formData.disponivel);
      
      if (formData.imagem) {
        submitData.append('imagem', formData.imagem);
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-group">
        <label htmlFor="nome">Nome do Produto</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          className={errors.nome ? 'error' : ''}
          disabled={loading}
        />
        {errors.nome && (
          <span className="error-text">{errors.nome}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          className={errors.descricao ? 'error' : ''}
          disabled={loading}
          rows={4}
        />
        {errors.descricao && (
          <span className="error-text">{errors.descricao}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="preco">Preço</label>
          <input
            type="number"
            id="preco"
            name="preco"
            value={formData.preco}
            onChange={handleChange}
            className={errors.preco ? 'error' : ''}
            disabled={loading}
            min="0"
            step="0.01"
          />
          {errors.preco && (
            <span className="error-text">{errors.preco}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="categoriaId">Categoria</label>
          <select
            id="categoriaId"
            name="categoriaId"
            value={formData.categoriaId}
            onChange={handleChange}
            className={errors.categoriaId ? 'error' : ''}
            disabled={loading}
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
          {errors.categoriaId && (
            <span className="error-text">{errors.categoriaId}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <div className="image-upload">
          <label htmlFor="imagem" className="image-label">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="image-preview"
              />
            ) : (
              <div className="upload-placeholder">
                <span className="material-icons">upload</span>
                <span>Clique para upload</span>
              </div>
            )}
          </label>
          <input
            type="file"
            id="imagem"
            name="imagem"
            onChange={handleImageChange}
            accept={UPLOAD.ALLOWED_IMAGE_TYPES.join(',')}
            className="image-input"
            disabled={loading}
          />
          {errors.imagem && (
            <span className="error-text">{errors.imagem}</span>
          )}
        </div>
      </div>

      <div className="form-group checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="disponivel"
            checked={formData.disponivel}
            onChange={handleChange}
            disabled={loading}
          />
          Produto disponível para venda
        </label>
      </div>

      <div className="form-actions">
        <LoadingButton
          type="submit"
          loading={loading}
          className="submit-button"
        >
          {produto ? 'Salvar Alterações' : 'Adicionar Produto'}
        </LoadingButton>

        <button
          type="button"
          onClick={onCancel}
          className="cancel-button"
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
