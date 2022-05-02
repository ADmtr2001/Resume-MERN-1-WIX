import React, { FC, PropsWithChildren, useState } from "react";

import { Wrapper } from "./AnnouncementList.styles";
import { IAnnouncement } from "../../types";
import Announcement from "./Announcement/Announcement";
import Loader from "../UI/Loader/Loader";

interface AnnouncementListProps {
  title: string;
  announcements: IAnnouncement[];
  isLoading: boolean;
  limit?: number;
  exceptions?: string[];
}

const AnnouncementList: FC<PropsWithChildren<AnnouncementListProps>> = ({
  title,
  announcements,
  isLoading,
  limit,
  exceptions,
}) => {
  const isGridView = true;

  if (isLoading) {
    return (
      <Wrapper>
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
      .map((announcement) => (
        <Announcement key={announcement._id} announcement={announcement} />
      ));
  } else {
    listContent = filteredAnnouncements.map((announcement) => (
      <Announcement key={announcement._id} announcement={announcement} />
    ));
  }

  return (
    <Wrapper>
      <h2 className='announcement-title'>{title}</h2>
      <div className={isGridView ? "announcements-grid" : "announcements-line"}>
        {listContent}
      </div>
    </Wrapper>
  );
};

export default AnnouncementList;
