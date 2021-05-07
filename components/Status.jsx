import { Result } from "antd";

export default function Status({ status, title, subTitle, extra }) {
  return (
    <Result status={status} title={title} subTitle={subTitle} extra={extra} />
  );
}
