import {Button, Modal} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

const OrderDetails = ({order, onClose}) => {



    return (
        <Modal centered show={true} onHide={onClose} size={"sm"}>
            <Modal.Header closeButton>
                <Modal.Title>№{order.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="card">
                    <div className="m-2">
                        <h6>Was ordered:</h6>
                        {order.orderItems.map((orderItem) => {
                            return (
                                <ul>
                                    <li key={orderItem.product_id}>{orderItem.product_name} - {orderItem.quantity}</li>
                                </ul>
                            )
                        })}


                        <span style={{fontWeight: '500'}}>Total price: </span>
                        <span style={{marginBottom: '5px'}}>{order.totalPrice}</span>

                        <h6 style={{marginTop: '10px'}}>Send to:</h6>
                        <p>{order.shipInfo.country}, {order.shipInfo.region} region, {order.shipInfo.city}</p>
                        <p>by {order.shipInfo.shippingType} to warehouse №{order.shipInfo.warehouseNumber}</p>

                        <h6>User Information:</h6>
                        <p>Name: {order.userInfo.lastName} {order.userInfo.lastName}</p>
                        <p>Email: {order.userInfo.email}</p>
                        <p>Phone number: {order.userInfo.phone}</p>
                    </div>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default OrderDetails;