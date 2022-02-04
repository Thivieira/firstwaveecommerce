export default function Ticket() {
  return (
    <div className="mt-5">
      <h2 className="text-base font-semibold text-black">
        O Boleto para o pagamento será exibido na próxma tela após Finalizar Pedido abaixo
      </h2>
      <ul className="mt-2">
        <p className="mb-2"> Imprima o boleto e pague no banco ou lotérica</p>
        <p className="mb-2"> Ou pague pela internet usando o código de barras</p>
        <p> O prazo de validade do boleto é de 2 dias úteis</p>
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
