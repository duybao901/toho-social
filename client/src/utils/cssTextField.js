import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const CssTextField = withStyles({
    root: {
        marginBottom: "20px",

        '& label': {
            fontSize: '16px',
            background: "#fff",
            padding: "0px 5px",
            "&.Mui-focused": {
                color: '#1DA1F2',
                background: "#fff",
                padding: "0px 5px",
            }
        },
        '& input': {
            fontSize: '16px',
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: '#1DA1F2',
                borderWidth: "3px",
            },
        },
    },
})(TextField);

export default CssTextField;