import React, { FC, PropsWithChildren, useState } from "react";

import { Wrapper } from "./AnnouncementList.styles";
import { IAnnouncement } from "../../types";
import Loader from "../UI/Loader/Loader";
import Pagination from "../Pagination/Pagination";
import BoxAnnouncement from "./BoxAnnouncement/BoxAnnouncement";
import LineAnnouncement from "./LineAnnouncement/LineAnnouncement";

interface AnnouncementListProps {
  title: string;
  announcements: IAnnouncement[];
  isLoading: boolean;
  limit?: number;
  exceptions?: string[];
  isPaginationVisible?: boolean;
  isGridView: boolean;
  Button?: JSX.Element;
}

const AnnouncementList: FC<PropsWithChildren<AnnouncementListProps>> = ({
  title,
  announcements,
  isLoading,
  limit,
  exceptions,
  isPaginationVisible = false,
  isGridView,
  Button,
}) => {
  if (isLoading) {
    return (
      <Wrapper>
        <h2 className='announcement-title'>{title}</h2>
        <Loader />
      </Wrapper>
    );
  }

  let filteredAnnouncements = announcements;

  if (exceptions) {
    filteredAnnouncements = filteredAnnouncements.filter(
      (announcement) => !exceptions.includes(announcement._id)
    );
  }

  let listContent: JSX.Element[];
  if (limit) {
    listContent = filteredAnnouncements
      .slice(0, limit)
      .map((announcement, index) => {
        if (isGridView) {
          return (
            <BoxAnnouncement
              className={
                announcement.isVip ? `an${index + 1} vip` : `an${index + 1}`
              }
              key={announcement._id}
              announcement={announcement}
            />
          );
        }
        return (
          <LineAnnouncement
            className={
              announcement.isVip ? `an${index + 1} vip` : `an${index + 1}`
            }
            key={announcement._id}
            announcement={announcement}
          />
        );
      });
  } else {
    listContent = filteredAnnouncements.map((announcement, index) => {
      if (isGridView) {
        return (
          <BoxAnnouncement
            className={
              announcement.isVip ? `an${index + 1} vip` : `an${index + 1}`
            }
            key={announcement._id}
            announcement={announcement}
          />
        );
      }
      return (
        <LineAnnouncement
          className={
            announcement.isVip ? `an${index + 1} vip` : `an${index + 1}`
          }
          key={announcement._id}
          announcement={announcement}
        />
      );
    });
  }

  return (
    <Wrapper>
      <h2 className='announcement-title'>{title}</h2>
      <div className={isGridView ? "announcements-grid" : "announcements-line"}>
        {listContent}
      </div>
      {isPaginationVisible && <Pagination />}
      {Button ? <div className='all-button'>{Button}</div> : null}
    </Wrapper>
  );
};

export default AnnouncementList;
