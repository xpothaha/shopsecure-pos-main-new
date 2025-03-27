
export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'เสร็จสิ้น';
    case 'pending':
      return 'รอดำเนินการ';
    case 'cancelled':
      return 'ยกเลิก';
    default:
      return status;
  }
};

export const getStatusClass = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
