import { ReactNode } from "react";

type listItem = string;
type id = string | number;
// в качестве ключей используются индексы, что не надежно

export default ({
  items,
  className,
  renderItem,
  ids,
}: {
  items: Array<listItem>;
  className: string;
  renderItem: (item: listItem) => ReactNode;
  ids?: Array<id>;
}) => {
  if (!items || items.length === 0) {
    return <div>No items found.</div>;
  }

  if (!ids) ids = [];

  return (
    <ul className={className}>
      {items.map((item, i) => (
        <li key={ids[i] || i}>{renderItem ? renderItem(item) : item}</li>
      ))}
    </ul>
  );
};
