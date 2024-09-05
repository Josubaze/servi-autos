export const PRODUCTVOID = {
    _id: '',
    name: '',
    description: '',
    category: '',
    price: 0,
    quantity: 0,
}



export const MENUCREATE= [
    { name: 'Presupuesto', href: '/create/budget' },
    { name: 'Factura', href: '/create/invoice' },
    { name: 'Informe', href: '/create/report' },
    { name: 'Orden de Compra', href: '/create/purchase-order' },
  ];
  export const MENUMANAGE = [
    { name: 'Almacén', href: '/storehouse' },
    { name: 'Clientes', href: '/clients', },
    { name: 'Proveedores', href: '/providers', },
  ];
  export const MENUCONTROL = [
    { name: 'Facturas', href: '/control/invoices' },
    { name: 'Presupuestos', href: '/control/budgets' },
    { name: 'Orden de Ejecución', href: '/control/orders' },
    { name: 'Orden de Compra', href: '/control/purchase-orders' },
  ];
  export const NAVITEMS = [
    { name: 'Inicio', href: '/' },
    { name: 'Iniciar Sesión', href: '/login' },
    { name: 'Registrarse', href: '/signup' },
  ];