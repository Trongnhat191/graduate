import React, { Component } from "react";
import { connect } from "react-redux";
import "./StaffManage.scss";
import imageIn from "../../assets/images/test.png";
import { manualPlateCorrectionEntry, manualPlateCorrectionExit, manualPaymentConfirm } from "../../services/sensorService";
class StaffManage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newNumberPlateIn: "",
			currentNumberPlateIn: "",
			imageIn: "",
			ticketTypeIn: "",

			newNumberPlateOut: "",
			currentNumberPlateOut: "",
			imageOut: "",
			ticketTypeOut: "",
			fee: "",
		};
	}

	componentDidMount() {
		this.ws = new WebSocket("ws://localhost:6969");

		this.ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			// console.log("check data from ws", data);
		
			// Cập nhật dữ liệu vào nếu có
			if (data.currentNumberPlateIn) {
				this.setState({
					newNumberPlateIn: "",
					currentNumberPlateIn: data.currentNumberPlateIn,
					imageIn: data.imageIn,
					ticketTypeIn: data.ticketTypeIn,
				});
			}
		
			// Cập nhật dữ liệu ra nếu có
			if (data.currentNumberPlateOut) {
				this.setState({
					newNumberPlateOut: "",
					currentNumberPlateOut: data.currentNumberPlateOut,
					imageOut: data.imageOut,
					ticketTypeOut: data.ticketTypeOut,
					fee: data.fee,
				});
			}
		};
	}

	componentWillUnmount() {
		if (this.ws) {
			this.ws.close();
		}
	}

	handleOnChangeInputIn = (event) => {
		let copyState = { ...this.state };
		copyState.newNumberPlateIn = event.target.value;
		this.setState({
			...copyState,
		});
	};
	handleOnChangeInputOut = (event) => {
		let copyState = { ...this.state };
		copyState.newNumberPlateOut = event.target.value;
		this.setState({
			...copyState,
		});
	}
	handlenewNumberPlateInUpdate = async () => {
		const wrongPlate = this.state.currentNumberPlateIn; // Nên lấy từ state/props thực tế
		const correctPlate = this.state.newNumberPlateIn;
		if (!correctPlate) {
			alert("Vui lòng nhập biển số mới");
			return;
		}
		try {
			let response = await manualPlateCorrectionEntry(wrongPlate, correctPlate);
			if (response && response.success) {
				alert("Cập nhật biển số thành công!");
				// Có thể cập nhật lại UI tại đây nếu cần
			} else {
				alert(response?.message || "Cập nhật thất bại!");
			}
		} catch (err) {
			alert("Có lỗi xảy ra khi cập nhật biển số!");
		}
	};
	handlenewNumberPlateOutUpdate = async () => {
		const correctPlate = this.state.newNumberPlateOut;
		if (!correctPlate) {
			alert("Vui long nhập biển số mới");
			return;
		}

		try {
			let response = await manualPlateCorrectionExit(correctPlate);
			if (response && response.success) {
				alert("Cập nhật biển số thành công!");
				// Có thể cập nhật lại UI tại đây nếu cần
			} else {
				alert(response?.message || "Cập nhật thất bại!");
			}
		} catch (err) {
			alert("Có lỗi xảy ra khi cập nhật biển số!");
		}
	}
	handleManualPaymentConfirm = async () => {
		console.log("check state from handleManualPaymentConfirm", this.state);
		const fee = this.state.fee;
		const numberPlate = this.state.currentNumberPlateOut;

		if (!numberPlate) {
            alert("Không có thông tin biển số xe ra.");
            return;
        }

        if (fee === "" || fee === null || fee === undefined) {
            alert("Không có thông tin phí hoặc phí bằng 0.");
            return;
        }

        try {
            let response = await manualPaymentConfirm(fee, numberPlate);
            if (response && response.errCode === 0) {
                alert(response.errMessage || "Thanh toán thành công!");
                // Optionally, clear the fee or update UI as needed
                this.setState({
                    fee: "", // Clear fee after successful payment
                    // currentNumberPlateOut: "", // Optionally clear number plate
                    // imageOut: "", // Optionally clear image
                    // ticketTypeOut: "" // Optionally clear ticket type
                });
            } else {
                alert(response?.errMessage || "Thanh toán thất bại!");
            }
        } catch (err) {
            console.error("Lỗi khi xác nhận thanh toán thủ công:", err);
            alert("Có lỗi xảy ra khi xác nhận thanh toán thủ công!");
        }
	}


	render() {
		return (
			// console.log("from render StaffMange", this.state),
			(
				<div className="staff-manage-container">
					<div className="staff-manage-content">
						<div className="title">Staff Management</div>
						<div className="content">
							<div className="content-left">
								<div className="content-left-title">CỬA VÀO</div>
								<div className="image-in">
									<img
										src={
											"http://localhost:6969/photos/entry/" + this.state.imageIn
										}
									/>
								</div>
								<div className="current-number-plate">
									<div className="current-number-plate-title">
										Biển số hiện tại
									</div>
									<div className="current-number-plate-content">
										{this.state.currentNumberPlateIn || "Chưa có dữ liệu"}
									</div>
								</div>
								<div className="ticket-type">
									<div className="ticket-type-title">Loại vé</div>
									<div className="ticket-type-content">
										{this.state.ticketTypeIn === "month"
											? "Vé tháng"
											: this.state.ticketTypeIn === "day"
												? "Vé ngày"
												: "Chưa có dữ liệu"}
									</div>
								</div>
								<div className="new-number-plate">
									<div className="new-number-plate-title">Biển số mới</div>
									<input
										className="new-number-plate-input"
										onChange={(event) => {
											this.handleOnChangeInputIn(event);
										}}
										type="text"
										placeholder="Nhập biển số mới"
									/>
									<button
										className="new-number-plate-button"
										onClick={() => {
											this.handlenewNumberPlateInUpdate();
										}}
									>
										Cập nhật
									</button>
								</div>
							</div>

							<div className="content-right">
								<div className="content-left-title">CỬA RA</div>

								<div className="image-in">
									<img
										src={
											"http://localhost:6969/photos/exit/" + this.state.imageOut
										}
									/>
								</div>
								<div className="right-info">
									<div className="right-info-1">
										<div className="current-number-plate">
											<div className="current-number-plate-title">
												Biển số hiện tại
											</div>
											<div className="current-number-plate-content">
												{this.state.currentNumberPlateOut || "Chưa có dữ liệu"}
											</div>
										</div>
										<div className="ticket-type">
											<div className="ticket-type-title">Loại vé</div>
											<div className="ticket-type-content">
												{this.state.ticketTypeOut === "month"
													? "Vé tháng"
													: this.state.ticketTypeOut === "day"
														? "Vé ngày"
														: "Chưa có dữ liệu"}
											</div>
										</div>
										<div className="new-number-plate">
											<div className="new-number-plate-title">Biển số mới</div>
											<input
												className="new-number-plate-input"
												onChange={(event) => {
													this.handleOnChangeInputOut(event);
												}}
												type="text"
												placeholder="Nhập biển số mới"
											/>
											<button
												className="new-number-plate-button"
												onClick={() => {
													this.handlenewNumberPlateOutUpdate();
												}}
											>
												Cập nhật
											</button>
										</div>
									</div>
									<div className="right-info-2">
										<div>
											Số tiền
										</div>
										<div>
											{this.state.fee ? this.state.fee + " VNĐ" : "Chưa có dữ liệu"}
										</div>
										<button className="right-info-button" onClick={() => {
											this.handleManualPaymentConfirm();}}>
											Thanh toán
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		);
	}
}

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(StaffManage);
