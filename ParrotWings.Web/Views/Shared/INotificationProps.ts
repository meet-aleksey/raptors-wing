export interface INotificationProps {

  show: boolean;

  text: string | string[];

  onClose: () => void;

}

export default INotificationProps;