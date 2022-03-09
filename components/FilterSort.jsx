import { Menu, Dropdown } from 'antd'
import { DownOutlined } from '@ant-design/icons'

export default function FilterSort({ handleChangeSort, sort }) {
  const menu = (
    <Menu value={sort} onClick={(obj) => handleChangeSort(obj.item)}>
      <Menu.Item value="menor">
        <a>Menor para maior</a>
      </Menu.Item>
      <Menu.Item value="maior">
        <a>Maior para menor</a>
      </Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu}>
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        Ordernar <DownOutlined />
      </a>
    </Dropdown>
  )
}
