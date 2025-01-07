export const PRODUCTVOID: Product = {
    _id: '',
    name: '',
    vehicleType: '',
    description: '',
    category: '',
    price: 0,
    quantity: 0,
}

export const COMPANYVOID : Company= {
  _id: '',
  id_card: '',
  name: '',
  email: '',
  phone: '',
  address: '',
};

export const CUSTOMERVOID : Customer= {
  _id: '',
  id_card: '',
  name: '',
  email: '',
  phone: '',
  address: '',
};

export const PROVIDERVOID: Provider = {
  _id: '',
  id_card: '',
  name: '',
  contactName: '',
  email: '',
  phone: '',
  address: '',
};

export const SERVICEVOID: Service = {
  _id: '',
  name: '',
  servicePrice: 0,
  serviceQuantity: 0,
  totalPrice: 0,
  products: [],
}

export const MENUPROFILE = [
  { name: 'Tu Perfil', href: '/profile' },
  { name: 'Cerrar Sesión', href: '/api/auth/signout' },
];

export const MENUCREATE= [
    { name: 'Factura', href: '/create/invoice' },
    { name: 'Informe', href: '/create/report' },
    { name: 'Nota de Credito', href: '/create/credit-note' },
    { name: 'Orden de Compra', href: '/create/purchase-order' },
    { name: 'Presupuesto', href: '/create/budget' },
  ];
  export const MENUMANAGE = [
    { name: 'Almacén', href: '/manage/storehouse' },
    { name: 'Clientes', href: '/manage/clients', },
    { name: 'Proveedores', href: '/manage/providers', },
    { name: 'Servicios', href: '/manage/services', },
  ];
  export const MENUCONTROL = [
    { name: 'Facturas', href: '/control/invoices' },
    { name: 'Informes', href: '/control/reports' },
    { name: 'Notas de Credito', href: '/control/credit-note' },
    { name: 'Ordenes de Ejecución', href: '/control/execution-orders' },
    { name: 'Ordenes de Compra', href: '/control/purchase-orders' },
    { name: 'Presupuestos', href: '/control/budgets' },
  ];
  export const NAVITEMS = [
    { name: 'Inicio', href: '/' },
    { name: 'Iniciar Sesión', href: '/login' },
    { name: 'Registrarse', href: '/signup' },
  ];