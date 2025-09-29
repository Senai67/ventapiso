import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Home, Bath, Square, Building, Phone, Mail, MessageCircle, CreditCard as Edit3, Save, X, Plus, Trash2, Check, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase, type ApartmentData, type Contact } from './lib/supabase';

const App = () => {
  // Estado principal del apartamento
  const [apartmentData, setApartmentData] = useState<ApartmentData>({
    title: 'Piso en venta en Calle de Pau Claris',
    price: '2.450.000 €',
    address: 'La Dreta de l\'Eixample, Barcelona',
    meters: '183',
    rooms: '3',
    bathrooms: '4',
    floor: 'Planta 5ª exterior con ascensor',
    description: `La vivienda dispone de tres dormitorios, cada uno con su baño en suite y vestidor. El salón-comedor es muy amplio y luminoso, con acceso a un balcón que da a la calle. La cocina está completamente equipada con electrodomésticos de alta gama.

El piso se encuentra en un edificio señorial de 1900, completamente rehabilitado, manteniendo el encanto arquitectónico original pero con todas las comodidades modernas.`,
    features: `Aire acondicionado
Balcón
Segunda mano/buen estado
Construido en 1900
Calefacción individual: Gas natural
Con ascensor
Certificado energético: E`,
    photos: [
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=1200'
    ]
  });

  // Estados de la interfaz
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showContacts, setShowContacts] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Estados del formulario de contacto
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: 'Hola, me interesa este piso y me gustaría hacer una visita.\nUn saludo'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  // Estados editables
  const [editData, setEditData] = useState<ApartmentData>({ ...apartmentData });

  // Verificar autenticación al cargar
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadApartmentData();
    loadContacts();
  }, []);

  // Actualizar datos editables cuando cambian los datos principales
  useEffect(() => {
    if (!isEditing) {
      setEditData({ ...apartmentData });
    }
  }, [apartmentData, isEditing]);

  // Cargar datos del apartamento desde Supabase
  const loadApartmentData = async () => {
    try {
      const { data, error } = await supabase
        .from('apartment_data')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading apartment data:', error);
        showMessage('Error al cargar los datos del apartamento');
        return;
      }

      if (data) {
        setApartmentData(data);
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Cargar contactos desde Supabase
  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading contacts:', error);
        return;
      }

      setContacts(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Mostrar mensaje temporal
  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // Manejar guardado de cambios
  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('apartment_data')
        .upsert({
          id: apartmentData.id,
          ...editData,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving data:', error);
        showMessage('Error al guardar los cambios');
        return;
      }

      setApartmentData({ ...editData });
      setIsEditing(false);
      showMessage('¡Cambios guardados con éxito!');
    } catch (error) {
      console.error('Error:', error);
      showMessage('Error de conexión');
    }
  };

  // Manejar cancelar edición
  const handleCancel = () => {
    setEditData({ ...apartmentData });
    setIsEditing(false);
    setNewPhotoUrl('');
  };

  // Añadir nueva foto
  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) {
      showMessage('Por favor, ingresa una URL válida');
      return;
    }
    
    const updatedPhotos = [...editData.photos, newPhotoUrl.trim()];
    setEditData({ ...editData, photos: updatedPhotos });
    setNewPhotoUrl('');
    showMessage('Foto añadida');
  };

  // Eliminar foto
  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = editData.photos.filter((_, i) => i !== index);
    setEditData({ ...editData, photos: updatedPhotos });
    
    if (currentPhotoIndex >= updatedPhotos.length && updatedPhotos.length > 0) {
      setCurrentPhotoIndex(updatedPhotos.length - 1);
    } else if (updatedPhotos.length === 0) {
      setCurrentPhotoIndex(0);
    }
    showMessage('Foto eliminada');
  };

  // Navegación de fotos
  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev < apartmentData.photos.length - 1 ? prev + 1 : 0
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev > 0 ? prev - 1 : apartmentData.photos.length - 1
    );
  };

  // Manejar cambios en el formulario de contacto
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  // Enviar formulario de contacto
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contacts')
        .insert([{
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          message: contactForm.message
        }]);

      if (error) {
        console.error('Error saving contact:', error);
        setFormMessage('Error al enviar el mensaje. Inténtalo de nuevo.');
        return;
      }

      setFormMessage('¡Gracias! Tu mensaje ha sido recibido. Te contactaremos pronto.');
      setContactForm({
        name: '',
        email: '',
        phone: '',
        message: 'Hola, me interesa este piso y me gustaría hacer una visita.\nUn saludo'
      });
      
      // Recargar contactos
      loadContacts();
    } catch (error) {
      console.error('Error:', error);
      setFormMessage('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Eliminar contacto
  const handleDeleteContact = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) {
        console.error('Error deleting contact:', error);
        showMessage('Error al eliminar el contacto');
        return;
      }

      setContacts(contacts.filter(contact => contact.id !== contactId));
      showMessage('Contacto eliminado');
    } catch (error) {
      console.error('Error:', error);
      showMessage('Error de conexión');
    }
  };

  // Exportar contactos a CSV
  const handleExportContacts = () => {
    if (contacts.length === 0) {
      showMessage('No hay contactos para exportar');
      return;
    }

    const csvContent = [
      ['Nombre', 'Email', 'Teléfono', 'Mensaje', 'Fecha'],
      ...contacts.map(contact => [
        contact.name,
        contact.email,
        contact.phone,
        contact.message.replace(/\n/g, ' '),
        new Date(contact.created_at || '').toLocaleString('es-ES')
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contactos-piso-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showMessage('Contactos exportados correctamente');
  };

  // Manejar intento de edición
  const handleEditAttempt = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      setIsEditing(true);
    }
  };

  // Manejar login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      setShowLoginModal(false);
      setIsEditing(true);
      setPassword('');
      setLoginError('');
      showMessage('¡Acceso concedido!');
    } else {
      setLoginError('Contraseña incorrecta');
      setPassword('');
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsEditing(false);
    setShowContacts(false);
    localStorage.removeItem('adminAuthenticated');
    showMessage('Sesión cerrada');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Mi Piso en Venta</h1>
            <div className="flex space-x-2">
              {isAuthenticated && isEditing && (
                <button
                  onClick={() => setShowContacts(!showContacts)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Contactos ({contacts.length})</span>
                </button>
              )}
              {isAuthenticated && isEditing && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors bg-red-600 hover:bg-red-700 text-white"
                >
                  <Lock className="h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </button>
              )}
              <button
                onClick={() => isEditing ? handleCancel() : handleEditAttempt()}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditing 
                    ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isEditing ? (
                  <>
                    <X className="h-4 w-4" />
                    <span>Cancelar</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    <span>Editar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de login */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Administrador</h2>
              <p className="text-gray-600">Ingresa la contraseña para editar el piso</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm">{loginError}</p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setPassword('');
                    setLoginError('');
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Acceder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Panel de contactos */}
      {isAuthenticated && showContacts && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Contactos Recibidos ({contacts.length})
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleExportContacts}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="h-4 w-4" />
                  <span>Exportar CSV</span>
                </button>
                <button
                  onClick={() => setShowContacts(false)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors bg-gray-500 hover:bg-gray-600 text-white"
                >
                  <X className="h-4 w-4" />
                  <span>Cerrar</span>
                </button>
              </div>
            </div>

            {contacts.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No hay contactos aún</p>
                <p className="text-sm text-gray-400">Los contactos aparecerán aquí cuando alguien envíe el formulario</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(contact.created_at || '').toLocaleString('es-ES')}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                              {contact.email}
                            </a>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                              {contact.phone}
                            </a>
                          </div>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteContact(contact.id!)}
                        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar contacto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galería de fotos */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {apartmentData.photos.length > 0 ? (
                <div className="relative">
                  <img
                    src={apartmentData.photos[currentPhotoIndex]}
                    alt={`Foto ${currentPhotoIndex + 1}`}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1200";
                    }}
                  />
                  
                  {apartmentData.photos.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronLeft className="h-6 w-6 text-gray-800" />
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronRight className="h-6 w-6 text-gray-800" />
                      </button>
                    </>
                  )}
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentPhotoIndex + 1} / {apartmentData.photos.length}
                  </div>
                </div>
              ) : (
                <div className="h-96 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No hay fotos disponibles</p>
                </div>
              )}

              {/* Gestión de fotos en modo edición */}
              {isEditing && (
                <div className="p-6 border-t bg-gray-50">
                  <h3 className="font-semibold mb-4">Gestionar Fotos</h3>
                  
                  {/* Añadir nueva foto */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="url"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="URL de la nueva foto"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddPhoto}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Añadir</span>
                    </button>
                  </div>

                  {/* Lista de fotos actuales */}
                  <div className="grid grid-cols-4 gap-2">
                    {editData.photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Miniatura ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleRemovePhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Información principal */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Título y precio */}
              <div className="mb-6">
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="text-3xl font-bold mb-4 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <h1 className="text-3xl font-bold mb-4 text-gray-900">{apartmentData.title}</h1>
                )}

                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      className="text-gray-600 flex-1 p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-gray-600">{apartmentData.address}</span>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.price}
                      onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                      className="text-3xl font-bold text-blue-600 p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-blue-600">{apartmentData.price}</span>
                  )}
                </div>
              </div>

              {/* Características principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Square className="h-5 w-5 text-blue-600" />
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.meters}
                        onChange={(e) => setEditData({ ...editData, meters: e.target.value })}
                        className="font-semibold w-16 p-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <span className="font-semibold">{apartmentData.meters} m²</span>
                    )}
                    <p className="text-sm text-gray-500">Construidos</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Home className="h-5 w-5 text-blue-600" />
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.rooms}
                        onChange={(e) => setEditData({ ...editData, rooms: e.target.value })}
                        className="font-semibold w-12 p-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <span className="font-semibold">{apartmentData.rooms}</span>
                    )}
                    <p className="text-sm text-gray-500">Habitaciones</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Bath className="h-5 w-5 text-blue-600" />
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.bathrooms}
                        onChange={(e) => setEditData({ ...editData, bathrooms: e.target.value })}
                        className="font-semibold w-12 p-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <span className="font-semibold">{apartmentData.bathrooms}</span>
                    )}
                    <p className="text-sm text-gray-500">Baños</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.floor}
                        onChange={(e) => setEditData({ ...editData, floor: e.target.value })}
                        className="font-semibold w-full p-1 border border-gray-300 rounded text-sm"
                      />
                    ) : (
                      <span className="font-semibold text-sm">{apartmentData.floor}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Descripción</h2>
                {isEditing ? (
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {apartmentData.description}
                  </p>
                )}
              </div>

              {/* Características */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Características</h2>
                {isEditing ? (
                  <textarea
                    value={editData.features}
                    onChange={(e) => setEditData({ ...editData, features: e.target.value })}
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Una característica por línea"
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {apartmentData.features.split('\n').filter(feature => feature.trim()).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature.trim()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botón de guardar en modo edición */}
              {isEditing && (
                <div className="mt-8 pt-6 border-t">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Guardar Cambios</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Formulario de contacto */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Pregunta al anunciante</h2>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    placeholder="Tu nombre *"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    placeholder="Tu email *"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactChange}
                    placeholder="Tu teléfono *"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{isSubmitting ? 'Enviando...' : 'Contactar'}</span>
                </button>
              </form>

              {formMessage && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">{formMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje flotante */}
      {message && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {message}
        </div>
      )}
    </div>
  );
};

export default App;