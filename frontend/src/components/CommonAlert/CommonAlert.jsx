import "./CommonAlert.scss";

function CommonAlert({
  type = "success",
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "Yes",
  cancelText = "Cancel",
}) {
  const isConfirm = type === "confirm";

  return (
    <div className="alert-overlay">
      <div className="common-alert">
        <div className={`alert-icon ${type}`}>
          {type === "success" && "✓"}
          {type === "error" && "!"}
          {type === "confirm" && "?"}
        </div>

        <h3>{title}</h3>

        <p>{message}</p>

        <div className="alert-actions">
          {isConfirm ? (
            <>
              <button
                className="alert-cancel-btn"
                onClick={onClose}
              >
                {cancelText}
              </button>

              <button
                className="alert-confirm-btn"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              className="alert-ok-btn"
              onClick={onClose}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommonAlert;