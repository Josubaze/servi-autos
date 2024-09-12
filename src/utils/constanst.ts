export const PRODUCTVOID = {
    _id: '',
    name: '',
    vehicle_type: '',
    description: '',
    category: '',
    price: 0,
    quantity: 0,
}

export const CUSTOMERVOID = {
  _id: '',
  name: '',
  email: '',
  phone: '',
  address: {
    city: '',
    state: ''
  },
};

export const PROVIDERVOID: Provider = {
  _id: '',
  name: '',
  contactName: '',
  email: '',
  phone: '',
  address: {
    city: '',
    state: ''
  }
};

export const MENUPROFILE = [
  { name: 'Tu Perfil', href: '/profile' },
  { name: 'Cerrar Sesión', href: '/api/auth/signout' },
];

export const MENUCREATE= [
    { name: 'Factura', href: '/create/invoice' },
    { name: 'Informe', href: '/create/report' },
    { name: 'Orden de Compra', href: '/create/purchase-order' },
    { name: 'Presupuesto', href: '/create/budget' },
  ];
  export const MENUMANAGE = [
    { name: 'Almacén', href: '/manage/storehouse' },
    { name: 'Clientes', href: '/manage/clients', },
    { name: 'Proveedores', href: '/manage/providers', },
  ];
  export const MENUCONTROL = [
    { name: 'Facturas', href: '/control/invoices' },
    { name: 'Informe', href: '/control/reports' },
    { name: 'Orden de Ejecución', href: '/control/execution-orders' },
    { name: 'Orden de Compra', href: '/control/purchase-orders' },
    { name: 'Presupuestos', href: '/control/budgets' },
  ];
  export const NAVITEMS = [
    { name: 'Inicio', href: '/' },
    { name: 'Iniciar Sesión', href: '/login' },
    { name: 'Registrarse', href: '/signup' },
  ];