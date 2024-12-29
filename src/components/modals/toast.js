import { toast, Toasts } from '@backpackapp-io/react-native-toast';

const ToastSuccess = ({ text, type }) => {
	// State to manage the editable title and message text

	return (
		toast.success({ text }, {
			width: 300,
			styles: {
				view: {
					backgroundColor: '#f7f7f7',
					borderRadius: 8,
					padding: 16,
				},
				text: {
					color: 'black',
				},
				indicator: {
					marginRight: 16,
				},
			},
		})
	)
};