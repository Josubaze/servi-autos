'use client'

import React from "react";
import dynamic from 'next/dynamic';

const LottieMoney = dynamic(() => import("src/components/LottieIcon/LottieMoney"), { ssr: false });
const LottieBudget = dynamic(() => import("src/components/LottieIcon/LottieBudget"), { ssr: false });
const LottieInvoice = dynamic(() => import("src/components/LottieIcon/LottieInvoice"), { ssr: false });
const LottiePersons = dynamic(() => import("src/components/LottieIcon/LottiePersons"), { ssr: false });
const LottieProduct = dynamic(() => import("src/components/LottieIcon/LottieProduct"), { ssr: false });
const LottieSupplier = dynamic(() => import("src/components/LottieIcon/LottieSupplier"), { ssr: false });

export const DashWidgets = () => {
  return (
      <div className="flex flex-wrap">
        <div className="w-full mb-3 md:w-1/2">
          <div className="p-4 bg-black-nav rounded-xl md:mr-4 hover:shadow-sm">
            <div className="font-title">Balance Total</div>
            <div className="flex justify-between items-center">
              <div className="h-30">
                <LottieMoney loop className="h-20" />
              </div>
              <div className="text-2xl mr-2">
                {/* <NumberFormat
                  value={totalBalance}
                  className=""
                  displayType={"text"}
                  thousandSeparator={true}
                  renderText={(value, props) => <span {...props}>{value}</span>}
                /> */}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mb-3 md:w-1/2">
          <div className="p-4 bg-black-nav rounded-xl hover:shadow-sm">
            <div className="font-title">Productos Totales</div>
            <div className="flex justify-between items-center">
              <div className="h-30">
                <LottieProduct loop className="h-20" />
              </div>
              <div className="text-2xl mr-2">
                {/* <NumberFormat
                  value={products?.length}
                  className=""
                  displayType={"text"}
                  thousandSeparator={true}
                  renderText={(value, props) => <span {...props}>{value}</span>}
                /> */}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mb-3 md:w-1/2">
          <div className="p-4 bg-black-nav rounded-xl md:mr-4 hover:shadow-sm">
            <div className="font-title">Presupuestos Totales</div>
            <div className="flex justify-between items-center">
              <div className="h-30">
                <LottieBudget loop className="h-20" />
              </div>
              <div className="text-2xl mr-2">
                {/* <NumberFormat
                  value={allInvoices?.length}
                  className=""
                  displayType={"text"}
                  thousandSeparator={true}
                  renderText={(value, props) => <span {...props}>{value}</span>}
                /> */}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full mb-3 md:w-1/2">
          <div className="p-4 bg-black-nav rounded-xl hover:shadow-sm">
            <div className="font-title">Clientes Totales</div>
            <div className="flex justify-between items-center">
              <div className="h-30">
                <LottiePersons loop className="h-20" />
              </div>
              <div className="text-2xl mr-2">
                {/* <NumberFormat
                  value={clients?.length}
                  className=""
                  displayType={"text"}
                  thousandSeparator={true}
                  renderText={(value, props) => <span {...props}>{value}</span>}
                /> */}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mb-3 md:w-1/2">
          <div className="p-4 bg-black-nav rounded-xl md:mr-4 hover:shadow-sm">
            <div className="font-title">Facturas Totales</div>
            <div className="flex justify-between items-center">
              <div className="h-30">
                <LottieInvoice loop className="h-20" />
              </div>
              <div className="text-2xl mr-2">
                {/* <NumberFormat
                  value={allInvoices?.length}
                  className=""
                  displayType={"text"}
                  thousandSeparator={true}
                  renderText={(value, props) => <span {...props}>{value}</span>}
                /> */}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mb-3 md:w-1/2">
          <div className="p-4 bg-black-nav rounded-xl hover:shadow-sm">
            <div className="font-title">Proveedores Totales</div>
            <div className="flex justify-between items-center">
              <div className="h-30">
                <LottieSupplier loop className="h-20" />
              </div>
              <div className="text-2xl mr-2">
                {/* <NumberFormat
                  value={clients?.length}
                  className=""
                  displayType={"text"}
                  thousandSeparator={true}
                  renderText={(value, props) => <span {...props}>{value}</span>}
                /> */}
              </div>
            </div>
          </div>
        </div>

      </div>
  );
}

