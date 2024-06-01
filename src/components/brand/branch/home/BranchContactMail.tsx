type EmailTemplateProps = {
  brandName: string;
  branchName: string;
  message: string;
}

const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    brandName,
    branchName,
    message
}) => (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', color: '#333' }}>
        <p style={{ fontSize: '18px', marginTop: '20px' }}>
        {brandName} / {branchName}:
        </p>
        <p style={{ fontSize: '16px', marginTop: '10px', whiteSpace: 'pre-wrap' }}>{message}</p>
  </div>
);

export default EmailTemplate;
