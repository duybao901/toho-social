const styles = theme => {
    return {
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            width: "600px",
            height: "650px",
            borderRadius: "15px",
            padding: '2px',
            outline: 'none',
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[5],
            overflow: 'hidden',
        },
    }
}
export default styles;