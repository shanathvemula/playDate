import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bookingsData = [
    {
        "id": "TNS0000005",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PVZTCFxKH6L2Jq",
        "signature": "39dce0c0adfba9ee813a9451407262aeb8d40b2813cecb201d62feafd4ea8447",
        "amount": "4000.00",
        "date_created": "2024-12-10T18:23:25.614286Z",
        "selectedSlots": [
            {
                "id": 13,
                "date": "2024-12-11T00:00:00",
                "price": 1000,
                "endTime": "13:00",
                "startTime": "12:00",
                "Availability": true
            },
            {
                "id": 14,
                "date": "2024-12-11T00:00:00",
                "price": 1000,
                "endTime": "14:00",
                "startTime": "13:00",
                "Availability": true
            },
            {
                "id": 15,
                "date": "2024-12-11T00:00:00",
                "price": 1000,
                "endTime": "15:00",
                "startTime": "14:00",
                "Availability": true
            },
            {
                "id": 16,
                "date": "2024-12-11T00:00:00",
                "price": 1000,
                "endTime": "16:00",
                "startTime": "15:00",
                "Availability": true
            }
        ],
        "amount_due": "4000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PVZSzq4f0CtScG",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-11T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000006",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PVZXan7L1JXk3C",
        "signature": "890c8c2a9dd4e7c5138fc38935e65bf808a00eec1fb7bbdb5e05fb5f0e9ab8a8",
        "amount": "1000.00",
        "date_created": "2024-12-10T18:27:35.193689Z",
        "selectedSlots": [
            {
                "id": 21,
                "date": "2024-12-11T00:00:00",
                "price": 1000,
                "endTime": "21:00",
                "startTime": "20:00",
                "Availability": true
            }
        ],
        "amount_due": "1000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PVZXOIhKhdrvaB",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-11T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000007",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PVZZWZzNrvV7Iz",
        "signature": "4243905876b9264aae7a46e005a5b527e8b154c58beb3c240b6387cd74c92f93",
        "amount": "1000.00",
        "date_created": "2024-12-10T18:29:17.072500Z",
        "selectedSlots": [
            {
                "id": 22,
                "date": "2024-12-11T00:00:00",
                "price": 1000,
                "endTime": "22:00",
                "startTime": "21:00",
                "Availability": true
            }
        ],
        "amount_due": "1000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PVZZBXe8EPc7GT",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-11T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000001",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PVZKC2oXBq3Z7p",
        "signature": "dd548eb1b16bcc82e022c82aa23880ccb8703cc22e7fdfa1c283049f9f168159",
        "amount": "1000.00",
        "date_created": "2024-12-10T18:14:55.855412Z",
        "selectedSlots": [
            {
                "id": 19,
                "date": "2024-12-11T00:00:00",
                "price": 1000,
                "endTime": "19:00",
                "startTime": "18:00",
                "Availability": true
            }
        ],
        "amount_due": "1000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PVZK1Mckb5jHcO",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-11T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000002",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PVZLy4xkjK5wWk",
        "signature": "91df931c1eb6f764aff1171aaa19c911945107b49d82ae3e395fe2d6b7d585d0",
        "amount": "1000.00",
        "date_created": "2024-12-10T18:16:37.390853Z",
        "selectedSlots": [
            {
                "id": 20,
                "date": "2024-12-11T00:00:00",
                "price": 1000,
                "endTime": "20:00",
                "startTime": "19:00",
                "Availability": true
            }
        ],
        "amount_due": "1000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PVZLoSIET7ScNa",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-11T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000003",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": null,
        "signature": null,
        "amount": "2000.00",
        "date_created": "2024-12-10T18:17:59.407389Z",
        "selectedSlots": [
            {
                "id": 17,
                "date": "2024-12-11T00:00:00",
                "price": 1000,
                "endTime": "17:00",
                "startTime": "16:00",
                "Availability": true
            },
            {
                "id": 18,
                "date": "2024-12-11T00:00:00",
                "price": 1000,
                "endTime": "18:00",
                "startTime": "17:00",
                "Availability": true
            }
        ],
        "amount_due": "2000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PVZNEpNFYfa5sh",
        "status": "created",
        "ground_booked_date": "2024-12-11T00:00:00Z",
        "user": "27",
        "message": null
    },
    {
        "id": "TNS0000004",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PVZS3CEKqGKHPg",
        "signature": "f6ac89d87016bca8a89c0e0b5d0ebd1c86144c5f8d1b00f65dca48ebaaeb7e5b",
        "amount": "2000.00",
        "date_created": "2024-12-10T18:22:22.211318Z",
        "selectedSlots": [
            {
                "id": 18,
                "date": "2024-12-11T00:00:00",
                "price": 1000,
                "endTime": "18:00",
                "startTime": "17:00",
                "Availability": true
            },
            {
                "id": 17,
                "date": "2024-12-11T00:00:00",
                "price": 1000,
                "endTime": "17:00",
                "startTime": "16:00",
                "Availability": true
            }
        ],
        "amount_due": "2000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PVZRsrIdRxApYr",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-11T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000008",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PVZb2aSQpkbC8K",
        "signature": "69ac22c8b6c6f3a6512b12127f36d47c4c5dd8e65337df57e1ade31ff97a4eb7",
        "amount": "1000.00",
        "date_created": "2024-12-10T18:30:50.403888Z",
        "selectedSlots": [
            {
                "id": 23,
                "date": "2024-12-11T00:00:00",
                "price": 1000,
                "endTime": "23:00",
                "startTime": "22:00",
                "Availability": true
            }
        ],
        "amount_due": "1000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PVZapF2F7DdYV9",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-11T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000009",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PVZcUgd2xW9XG4",
        "signature": "d700024a085fbb96f7223d2199b4bbe6aec533f0662a8d812d0f224b5d141282",
        "amount": "1000.00",
        "date_created": "2024-12-10T18:32:14.977310Z",
        "selectedSlots": [
            {
                "id": 24,
                "date": "2024-12-11T00:00:00",
                "price": 1000,
                "endTime": "23:59",
                "startTime": "23:00",
                "Availability": true
            }
        ],
        "amount_due": "1000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PVZcJwyRZ7FiMm",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-11T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000010",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PVZkHqGC1WLTCn",
        "signature": "15a9b618fffa0eb03b1fd8c77e64b71eff10c8b81a0b9429bb99efedb1f0d42f",
        "amount": "1000.00",
        "date_created": "2024-12-10T18:39:39.643666Z",
        "selectedSlots": [
            {
                "id": 12,
                "date": "2024-12-11T00:00:00",
                "price": 1000,
                "endTime": "12:00",
                "startTime": "11:00",
                "Availability": true
            }
        ],
        "amount_due": "1000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PVZk9GJsImjldZ",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-11T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000011",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PVZoP6by2gW1JC",
        "signature": "ad14e554d13e50d816096911df9a61c34e4b4fd258fde6e0f557d8c059b953cf",
        "amount": "1000.00",
        "date_created": "2024-12-10T18:43:32.167141Z",
        "selectedSlots": [
            {
                "id": 11,
                "date": "2024-12-11T00:00:00",
                "price": 1000,
                "endTime": "11:00",
                "startTime": "10:00",
                "Availability": true
            }
        ],
        "amount_due": "1000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PVZoF7ccZK9bdk",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-11T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000015",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": null,
        "signature": null,
        "amount": "2400.00",
        "date_created": "2024-12-15T17:20:05.253321Z",
        "selectedSlots": [
            {
                "id": 8,
                "date": "2024-12-15T00:00:00",
                "price": 800,
                "endTime": "08:00",
                "startTime": "07:00",
                "Availability": true
            },
            {
                "id": 10,
                "date": "2024-12-15T00:00:00",
                "price": 800,
                "endTime": "10:00",
                "startTime": "09:00",
                "Availability": true
            },
            {
                "id": 6,
                "date": "2024-12-15T00:00:00",
                "price": 800,
                "endTime": "06:00",
                "startTime": "05:00",
                "Availability": true
            }
        ],
        "amount_due": "2400.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PXX3dmxgFgEiDl",
        "status": "created",
        "ground_booked_date": "2024-12-15T00:00:00Z",
        "user": "27",
        "message": null
    },
    {
        "id": "TNS0000012",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PVZudLzj47FU3D",
        "signature": "874cf12ec293fe937613927ca120dfcfe6c53657cb15e4a465fbe38b4f07d988",
        "amount": "1000.00",
        "date_created": "2024-12-10T18:49:24.625025Z",
        "selectedSlots": [
            {
                "id": 10,
                "date": "2024-12-11T00:00:00",
                "price": 1000,
                "endTime": "10:00",
                "startTime": "09:00",
                "Availability": true
            }
        ],
        "amount_due": "1000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PVZuRnjnQk34rj",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-11T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000013",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PVtaRhcxBUics1",
        "signature": "01c15589cc7cf337d0d7c1823b84561e0cfe47cf12da43e47bf070cfae1adc4f",
        "amount": "1600.00",
        "date_created": "2024-12-11T14:04:00.851448Z",
        "selectedSlots": [
            {
                "id": 11,
                "date": "2024-12-15T00:00:00",
                "price": 800,
                "endTime": "11:00",
                "startTime": "10:00",
                "Availability": true
            },
            {
                "id": 15,
                "date": "2024-12-15T00:00:00",
                "price": 800,
                "endTime": "15:00",
                "startTime": "14:00",
                "Availability": true
            }
        ],
        "amount_due": "1600.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PVtZxPSSHJmm6O",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-15T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000014",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": null,
        "signature": null,
        "amount": "2400.00",
        "date_created": "2024-12-15T17:20:04.403517Z",
        "selectedSlots": [
            {
                "id": 8,
                "date": "2024-12-15T00:00:00",
                "price": 800,
                "endTime": "08:00",
                "startTime": "07:00",
                "Availability": true
            },
            {
                "id": 10,
                "date": "2024-12-15T00:00:00",
                "price": 800,
                "endTime": "10:00",
                "startTime": "09:00",
                "Availability": true
            },
            {
                "id": 6,
                "date": "2024-12-15T00:00:00",
                "price": 800,
                "endTime": "06:00",
                "startTime": "05:00",
                "Availability": true
            }
        ],
        "amount_due": "2400.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PXX3bog3i7zbUo",
        "status": "created",
        "ground_booked_date": "2024-12-15T00:00:00Z",
        "user": "27",
        "message": null
    },
    {
        "id": "TNS0000022",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PYKeNJMyqRtkwJ",
        "signature": "fae0271d6b8e9d6950c29301a74817a514ec92f5361fbe97058d9f1eda8c5285",
        "amount": "1000.00",
        "date_created": "2024-12-17T17:50:46.343532Z",
        "selectedSlots": [
            {
                "id": 3,
                "date": "2024-12-18T00:00:00",
                "price": 1000,
                "endTime": "03:00",
                "startTime": "02:00",
                "Availability": true
            }
        ],
        "amount_due": "1000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PYKeCy2ASF7fAt",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-18T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000016",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PXXqMPw3xGUbNH",
        "signature": "908d28bbcddd8b41b6e779cf83e3e54e45d4df6e12c5d7de071a14f108b10db0",
        "amount": "3000.00",
        "date_created": "2024-12-15T18:06:04.092459Z",
        "selectedSlots": [
            {
                "id": 2,
                "date": "2024-12-16T00:00:00",
                "price": 1000,
                "endTime": "02:00",
                "startTime": "01:00",
                "Availability": true
            },
            {
                "id": 3,
                "date": "2024-12-16T00:00:00",
                "price": 1000,
                "endTime": "03:00",
                "startTime": "02:00",
                "Availability": true
            },
            {
                "id": 4,
                "date": "2024-12-16T00:00:00",
                "price": 1000,
                "endTime": "04:00",
                "startTime": "03:00",
                "Availability": true
            }
        ],
        "amount_due": "3000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PXXqDAO2ffw0Cz",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-16T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000017",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PXXtzuZBOYG9cs",
        "signature": "b2cfa5dd783b8cf5b1150486c88e2009f07a6ca5051ca359ecbb99b2375f9547",
        "amount": "2000.00",
        "date_created": "2024-12-15T18:09:29.704771Z",
        "selectedSlots": [
            {
                "id": 5,
                "date": "2024-12-16T00:00:00",
                "price": 1000,
                "endTime": "05:00",
                "startTime": "04:00",
                "Availability": true
            },
            {
                "id": 6,
                "date": "2024-12-16T00:00:00",
                "price": 1000,
                "endTime": "06:00",
                "startTime": "05:00",
                "Availability": true
            }
        ],
        "amount_due": "2000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PXXtpgLbNDIey5",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-16T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000018",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": null,
        "signature": null,
        "amount": "2000.00",
        "date_created": "2024-12-17T17:13:11.724308Z",
        "selectedSlots": [
            {
                "id": 2,
                "date": "2024-12-17T00:00:00",
                "price": 1000,
                "endTime": "02:00",
                "startTime": "01:00",
                "Availability": true
            },
            {
                "id": 18,
                "date": "2024-12-17T00:00:00",
                "price": 1000,
                "endTime": "18:00",
                "startTime": "17:00",
                "Availability": true
            }
        ],
        "amount_due": "2000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PYK0WKxdzhdtfM",
        "status": "created",
        "ground_booked_date": "2024-12-17T00:00:00Z",
        "user": "27",
        "message": null
    },
    {
        "id": "TNS0000019",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PYK0pwVnAHN9ku",
        "signature": "612eb0497705e7fb6e1e0915dc0acb329a43ad0774cfe9b329d464985ddef336",
        "amount": "2000.00",
        "date_created": "2024-12-17T17:13:12.807663Z",
        "selectedSlots": [
            {
                "id": 2,
                "date": "2024-12-17T00:00:00",
                "price": 1000,
                "endTime": "02:00",
                "startTime": "01:00",
                "Availability": true
            },
            {
                "id": 18,
                "date": "2024-12-17T00:00:00",
                "price": 1000,
                "endTime": "18:00",
                "startTime": "17:00",
                "Availability": true
            }
        ],
        "amount_due": "2000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PYK0XWYaGfuuXd",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-17T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000020",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PYKGChlozRXJP3",
        "signature": "fc8ff0465da52000dcf057b56c5bcbc2bd59130f3c1234e0992c00080d57a554",
        "amount": "3000.00",
        "date_created": "2024-12-17T17:27:52.962732Z",
        "selectedSlots": [
            {
                "id": 8,
                "date": "2024-12-17T00:00:00",
                "price": 1000,
                "endTime": "08:00",
                "startTime": "07:00",
                "Availability": true
            },
            {
                "id": 9,
                "date": "2024-12-17T00:00:00",
                "price": 1000,
                "endTime": "09:00",
                "startTime": "08:00",
                "Availability": true
            },
            {
                "id": 24,
                "date": "2024-12-17T00:00:00",
                "price": 1000,
                "endTime": "23:59",
                "startTime": "23:00",
                "Availability": true
            }
        ],
        "amount_due": "3000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PYKG21K4TLrvfE",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-17T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000021",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PYKTJpkNegcHGe",
        "signature": "6e4432edfff0bc3ee37c7854deab474ad6a688ed1ac262988745efdc35a95189",
        "amount": "2000.00",
        "date_created": "2024-12-17T17:40:18.957437Z",
        "selectedSlots": [
            {
                "id": 2,
                "date": "2024-12-18T00:00:00",
                "price": 1000,
                "endTime": "02:00",
                "startTime": "01:00",
                "Availability": true
            },
            {
                "id": 7,
                "date": "2024-12-18T00:00:00",
                "price": 1000,
                "endTime": "07:00",
                "startTime": "06:00",
                "Availability": true
            }
        ],
        "amount_due": "2000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PYKTAMbIUBpvwu",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-18T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000023",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": "pay_PYgvKlaQ3OBhuQ",
        "signature": "15964ea6451e2a8a7e57c085770b3c099727cfb05505eb8e888dc607636375fa",
        "amount": "1000.00",
        "date_created": "2024-12-18T15:38:01.799810Z",
        "selectedSlots": [
            {
                "id": 24,
                "date": "2024-12-18T00:00:00",
                "price": 1000,
                "endTime": "23:59",
                "startTime": "23:00",
                "Availability": true
            }
        ],
        "amount_due": "1000.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PYgv9ZYqtrrdD2",
        "status": "SUCCESS",
        "ground_booked_date": "2024-12-18T00:00:00Z",
        "user": "27",
        "message": "Payment successful"
    },
    {
        "id": "TNS0000024",
        "groundId": {
            "id": "GRD0000002",
            "ground_name": "City Stadium",
            "name": "Football",
            "description": "1200ft x 800ft wide football ground suitable for professional games...",
            "address": "Hyderabad",
            "type": "Wood",
            "capacity": 24,
            "contact_number": "9014050007",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "02:00",
                    "startTime": "01:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                }
            ]
        },
        "payment_id": null,
        "signature": null,
        "amount": "800.00",
        "date_created": "2024-12-22T16:01:18.769121Z",
        "selectedSlots": [
            {
                "id": 22,
                "date": "2024-12-22T00:00:00",
                "price": 800,
                "endTime": "22:00",
                "startTime": "21:00",
                "Availability": true
            }
        ],
        "amount_due": "800.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PaHSAkL3A7kURq",
        "status": "created",
        "ground_booked_date": "2024-12-22T00:00:00Z",
        "user": "shanath1213@gmail.com",
        "message": null
    },
    {
        "id": "TNS0000025",
        "groundId": {
            "id": "GRD0000001",
            "ground_name": "YDSC Ground",
            "name": "Cricket",
            "description": "1234ft x 672ft wide cricket ground optimal for all your gameplays...",
            "address": "Bangalore",
            "type": "Grass",
            "capacity": 12,
            "contact_number": "9908564639",
            "maintenanceSchedule": [
                {
                    "days": [
                        "Mon",
                        "Tue"
                    ],
                    "endTime": "01:00",
                    "startTime": "00:00"
                },
                {
                    "days": [
                        "Wed",
                        "Thu"
                    ],
                    "endTime": "05:00",
                    "startTime": "04:00"
                },
                {
                    "days": [
                        "Fri",
                        "Sat",
                        "Sun"
                    ],
                    "endTime": "07:00",
                    "startTime": "06:00"
                },
                {
                    "days": [
                        "Sun"
                    ],
                    "endTime": "12:00",
                    "startTime": "11:00"
                }
            ]
        },
        "payment_id": null,
        "signature": null,
        "amount": "1600.00",
        "date_created": "2024-12-22T21:07:54.079232Z",
        "selectedSlots": [
            {
                "id": 3,
                "date": "2024-12-23T00:00:00",
                "price": 800,
                "endTime": "03:00",
                "startTime": "02:00",
                "Availability": true
            },
            {
                "id": 4,
                "date": "2024-12-23T00:00:00",
                "price": 800,
                "endTime": "04:00",
                "startTime": "03:00",
                "Availability": true
            }
        ],
        "amount_due": "1600.00",
        "amount_paid": "0.00",
        "attempts": 0,
        "currency": "INR",
        "order_id": "order_PaMg2vUDhjYU9Z",
        "status": "created",
        "ground_booked_date": "2024-12-23T00:00:00Z",
        "user": "shanath1213@gmail.com",
        "message": null
    }
];

  // Map bookings data to events for FullCalendar
  const calendarEvents = bookingsData.flatMap(({ groundId, selectedSlots }) =>
    selectedSlots.map(({ id, date, startTime, endTime, Availability, price }) => ({
      id: `${id}`,
      title: `${groundId.ground_name} - ${Availability ? "Available" : "Maintenance"}`,
      start: `${date.split("T")[0]}T${startTime}:00`,
      end: `${date.split("T")[0]}T${endTime}:00`,
      backgroundColor: Availability ? "#4caf50" : "#ffa500",
      borderColor: Availability ? "#4caf50" : "#ff8c00",
      extendedProps: { date, startTime, endTime, Availability, price, groundName: groundId.ground_name },
    }))
  );

  // Handle slot click
  const handleEventClick = ({ event }) => {
    setSelectedSlot(event.extendedProps);
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-lg p-6">
        <h2 className="font-bold text-lg mb-4 text-center">Select a Date</h2>
        <Calendar onChange={setSelectedDate} value={selectedDate} className="mb-6" />
        <button className="w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-3 rounded-lg mb-6 font-semibold hover:from-blue-500 hover:to-blue-700 transition">
          Book Ground
        </button>
        <div className="bg-gray-100 rounded-lg shadow-md p-4">
          <h2 className="font-bold text-lg mb-3">Selected Date</h2>
          <p className="text-gray-700">{selectedDate.toDateString()}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-4">Booking Schedule</h1>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            events={calendarEvents}
            dateClick={({ dateStr }) => setSelectedDate(new Date(dateStr))}
            eventClick={handleEventClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialDate={selectedDate.toISOString().split("T")[0]}
            selectable
            editable={false}
            height="80vh"
          />
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && selectedSlot && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-4/5 md:w-1/3 max-w-lg">
            <h2 className="text-xl font-bold mb-4">Slot Information</h2>
            <div className="mb-4">
              <p className="flex items-center mb-2">
                <span className="font-semibold">Ground Name:</span>
                <span className="ml-2">{selectedSlot.groundName}</span>
              </p>
              <p className="flex items-center mb-2">
                <span className="font-semibold">Date:</span>
                <span className="ml-2">{new Date(selectedSlot.date).toDateString()}</span>
              </p>
              <p className="flex items-center mb-2">
                <span className="font-semibold">Start Time:</span>
                <span className="ml-2">{selectedSlot.startTime}</span>
              </p>
              <p className="flex items-center mb-2">
                <span className="font-semibold">End Time:</span>
                <span className="ml-2">{selectedSlot.endTime}</span>
              </p>
              <p className="flex items-center mb-2">
                <span className="font-semibold">Price:</span>
                <span className="ml-2">₹{selectedSlot.price}</span>
              </p>
              <div className="flex items-center mb-2">
                <span className="font-semibold">Availability:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded ${
                    selectedSlot.Availability ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                  }`}
                >
                  {selectedSlot.Availability ? "Available" : "Maintenance"}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
