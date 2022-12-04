import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem(props) {
  const buttonClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "button--danger": props.spots === 0
  });

  const formatSpots = (spots) => {
    let formattedSpot = `${spots} spots remaining`;

    if (spots === 0) {
      return 'no spots remaining';
    }

    if (spots === 1) {
      return '1 spot remaining';
    }

    return formattedSpot;
  };

  return (
    <li className={buttonClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}