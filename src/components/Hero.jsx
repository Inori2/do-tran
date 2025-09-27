export default function Hero({ isPreloaderDone }) {
  return (
    <>
      <div className="fixed bottom-0 w-screen p-5 mix-blend-difference">
        <div className="flex justify-between w-full items-end">
          <div className="heading font-secondary text-8xl lg:text-9xl text-neutral-50 select-none leading-20">
            Do Tran
          </div>
          <div className="infor-wrapper grid grid-cols-3 gap-20">
            <div className="items col-span-1 text-neutral-50">PHOTOGRAPHER</div>
            <div className="items col-span-1 text-neutral-50">FOLIO ©2025</div>
            <div className="items col-span-1 text-neutral-50">Made by Sang</div>
          </div>
        </div>
      </div>
    </>
  );
}
