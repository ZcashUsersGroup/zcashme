function QRModal({address}) {
    const qrUrl = address
      ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&color=283748&bgcolor=f2cda3&data=${encodeURIComponent(address)}`
      : '';
  
    return (
        <div className="w-[280px] h-[280px] border-8 border-primary/60 bg-background rounded-lg flex flex-col items-center justify-center relative">
            {address ? (
            <>
                <img 
                    src={qrUrl} 
                    alt="QR Code" 
                    className="w-full h-full object-contain" 
                />
            </>
            ) : (
                <p className="text-sm text-primary/60 italic">No wallet address available</p>
            )}
      </div>
    );
}

export default QRModal;