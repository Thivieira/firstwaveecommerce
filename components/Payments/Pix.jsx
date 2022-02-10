export default function Pix() {
  return (
    <div className="mt-5">
      <h2 className="text-base font-semibold text-black">
        O código do PIX para o pagamento será exibido na próxima tela após Finalizar Pedido abaixo
      </h2>
      <ul className="mt-2 sm:ml-8">
        <li className="mb-2"> Pague via boleto e receba 12% de desconto</li>
        <li className="mb-2"> Pague em qualquer horário pelo celular</li>
        <li> O pagamento é instantâneo e pode ser feito em poucos segundos de forma segura</li>
      </ul>

      <div className="flex justify-start pt-6 mt-10 border-t border-gray-200">
        <button
          type="submit"
          className="bg-[#0080a8] border border-transparent uppercase rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-[#0080a8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-[#0080A8]"
        >
          Finalizar Pedido
        </button>
        {/* <progress value="0" className="progress-bar">
        Carregando...
      </progress> */}
      </div>
    </div>
  )
}
