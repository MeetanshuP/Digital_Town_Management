import RouteMap from "./RouteMap";

const DirectionsModal = ({ isOpen, onClose, userLocation, serviceLocation }) => {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>

                {/* Header */}
                <div style={styles.header}>
                    <h3>Directions</h3>
                    <button onClick={onClose} style={styles.closeBtn}>
                        ✖
                    </button>
                </div>

                {/* Map */}
                <RouteMap
                    userLocation={userLocation}
                    serviceLocation={serviceLocation}
                />
            </div>
        </div>
    );
};

export default DirectionsModal;

// 🎨 Basic Styles
const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
    },
    modal: {
        background: "#fff",
        width: "90%",
        height: "90%",
        borderRadius: "12px",
        padding: "10px",
        display: "flex",
        flexDirection: "column"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px"
    },
    closeBtn: {
        background: "red",
        color: "#fff",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer",
        borderRadius: "5px"
    }
};