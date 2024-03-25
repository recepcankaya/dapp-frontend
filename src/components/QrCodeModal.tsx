import { FC } from "react";
import QRCode from "react-qr-code";

type QrCodeModalProps = {
  onClose: () => void;
  isVisible: boolean;
  value: string;
};

const QrCodeModal: FC<QrCodeModalProps> = ({ isVisible, onClose, value }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <button
        onClick={onClose}
        className="fixed inset-0 w-full h-full cursor-default"
      />
      <div className="p-4 bg-white rounded-lg">
        <QRCode value={value} size={280} />
      </div>
    </div>
  );
};

export default QrCodeModal;
