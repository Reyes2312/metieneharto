import React, { useContext, useState } from 'react';
import './NavComp.css'; 
import logoImg from '../../assets/logo.png'; 
import { AuthContext } from '../../context/AuthContext';
import { LoginComp } from './LoginComp';
import { RegisterComp } from './RegisterComp';
import { AdminLoginComp } from './AdminLoginComp';
import { Modal } from 'react-bootstrap';

export const NavComp = () => {
  const { currentUser, logout, adminLogin } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);
  
  const openRegister = () => {
    setShowRegister(true);
    setShowLogin(false); 
  };

  const closeRegister = () => setShowRegister(false);
  
  const openAdminLogin = () => {
    setShowAdminLogin(true);
    setShowLogin(false); 
  };

  const closeAdminLogin = () => setShowAdminLogin(false);

  const handleAdminLoginSuccess = () => {
    
    closeAdminLogin(); 
  };

  const goBackToLogin = () => {
    setShowLogin(true); 
    setShowRegister(false); 
  };

  return (
    <>
      <nav className="navbar sticky-top">
        <div className="container">
          <div className="navbar-brand">
            <img src={logoImg} alt="logo" />
          </div>
          <div className="d-flex justify-content-end">
            {currentUser ? (
              <>
                <div className="btn mx-2 disabled">
                  {currentUser.email}
                </div>
                <div
                  onClick={() => logout()}
                  className="btn mx-2"
                >
                  Salir de cuenta
                </div>
              </>
            ) : (
              <div className="btn mx-2" onClick={openLogin}>
                Iniciar Sesión
              </div>
            )}
          </div>
        </div>

        
        <Modal centered show={showLogin} onHide={closeLogin}>
          <Modal.Header closeButton>
            <Modal.Title>Iniciar Sesión</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <LoginComp closeLogin={closeLogin} />
            <div className="mt-3">
              No tienes una cuenta?{' '}
              <span
                className="register-link"
                onClick={openRegister}
              >
                Regístrate aquí
              </span>
            </div>
            <div className="mt-3">
              ¿Eres administrador?{' '}
              <span
                className="admin-login-link"
                onClick={openAdminLogin}
              >
                Iniciar sesión 
              </span>
            </div>
          </Modal.Body>
        </Modal>

        <Modal centered show={showRegister} onHide={closeRegister}>
          <Modal.Header closeButton>
            <Modal.Title>Registrarse</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RegisterComp closeRegister={closeRegister} goBackToLogin={goBackToLogin} />
          </Modal.Body>
        </Modal>

      
        <Modal centered show={showAdminLogin} onHide={closeAdminLogin}>
          <Modal.Header closeButton>
            <Modal.Title>Iniciar Sesión Administrador</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AdminLoginComp adminLogin={adminLogin} onSuccess={handleAdminLoginSuccess} />
          </Modal.Body>
        </Modal>
      </nav>
    </>
  );
};
