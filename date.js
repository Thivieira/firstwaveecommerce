import dayjs from "dayjs";

import "dayjs/locale/pt-br"; // ES 2015

dayjs.locale("pt-br"); // use locale globally

export const formatDate = (input, format = "DD/MM/YYYY") =>
  dayjs(input).format(format); // '25/01/2019'
