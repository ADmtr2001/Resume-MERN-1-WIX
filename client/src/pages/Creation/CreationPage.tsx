import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/UI/Button/Button";
import FormInput from "../../components/UI/Input/FormInput";
import Loader from "../../components/UI/Loader/Loader";
import FormSelect from "../../components/UI/Select/FormSelect";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  asyncCreateAnnouncement,
  asyncGetSingleAnnouncement,
  asyncUpdateAnnouncement,
} from "../../store/reducers/announcement/announcementActionCreators";
import {
  clearCurrentAnnouncement,
  clearUpdatedAndCreatedAnnouncement,
} from "../../store/reducers/announcement/announcementSlice";
import { asyncFetchCategories } from "../../store/reducers/category/categoryActionCreators";
import { IOption } from "../../types";
import { ICreationFormData } from "../../types/IFormData";
import { scrollToTop } from "../../utils";

import { Wrapper } from "./CreationPage.styles";
import FormTextArea from "../../components/UI/TextArea/FormTextArea";

const CreationPage = () => {
  const { id: announcementId } = useParams();
  const [defaultValues, setDefaultValues] = useState<{
    [index: string]: string | FileList;
  }>({});
  const { categories, isCategoriesLoading } = useAppSelector(
    (state) => state.category
  );
  const dispatch = useAppDispatch();
  const {
    currentAnnouncement,
    isCurrentAnnouncementLoading,
    updatedAnnouncement,
    createdAnnouncement,
    isAnnouncementCreating,
    isAnnouncementUpdating,
  } = useAppSelector((state) => state.announcement);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ICreationFormData>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
  });
  const location = useLocation();

  useEffect(() => {
    scrollToTop();
    if (categories.length === 0) {
      dispatch(asyncFetchCategories());
    }
    if (announcementId) {
      dispatch(asyncGetSingleAnnouncement(announcementId));
    }
    return () => {
      dispatch(clearCurrentAnnouncement());
      dispatch(clearUpdatedAndCreatedAnnouncement());
    };
  }, []);

  useEffect(() => {
    if (currentAnnouncement) {
      console.log(currentAnnouncement);
      setDefaultValues({
        title: currentAnnouncement.title,
        category: currentAnnouncement.category,
        price: currentAnnouncement.price.toString(),
        description: currentAnnouncement.description,
        location: currentAnnouncement.location,
        email: currentAnnouncement.email,
        phoneNumber: currentAnnouncement.phoneNumber,
      });
      reset(defaultValues);
    }
  }, [currentAnnouncement]);

  useEffect(() => {
    if (updatedAnnouncement) {
      navigate(`/announcement/${updatedAnnouncement._id}`);
    }
    if (createdAnnouncement) {
      navigate(`/announcement/${createdAnnouncement._id}`);
    }
  }, [updatedAnnouncement, createdAnnouncement]);

  const onSubmit: SubmitHandler<ICreationFormData> = (data) => {
    const announcementData = new FormData();
    announcementData.append("title", data.title);
    announcementData.append("category", data.category);
    announcementData.append("price", data.price);
    announcementData.append("description", data.description);
    announcementData.append("location", data.location);
    announcementData.append("email", data.email);
    announcementData.append("phoneNumber", data.phoneNumber);
    if (data.image) {
      // @ts-ignore
      announcementData.append("image", data.image[0]);
    }

    if (announcementId) {
      dispatch(
        asyncUpdateAnnouncement({ data: announcementData, id: announcementId })
      );
    } else {
      dispatch(asyncCreateAnnouncement(announcementData));
    }
  };

  let selectOptions: IOption[] = useMemo(() => {
    const options = categories.map((category) => {
      return { label: category.name, value: category._id };
    });
    return [{ label: "Any", value: "62782d01909cc2389eb9e4c5" }, ...options];
  }, [categories]);

  if (isCategoriesLoading || isCurrentAnnouncementLoading) {
    return <Loader />;
  }

  return (
    <Wrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput<ICreationFormData>
          label="Title"
          name="title"
          register={register}
          options={{
            required: "Please provide title",
            minLength: { value: 3, message: "Min length: 3" },
            maxLength: { value: 50, message: "Max length: 50" },
          }}
          error={errors.title?.message}
          fullWidth
        />
        <FormSelect<ICreationFormData>
          label="Category"
          name="category"
          options={selectOptions}
          register={register}
          fullWidth
        />
        <FormInput<ICreationFormData>
          label="Price"
          name="price"
          type="number"
          register={register}
          options={{
            required: "Please provide price",
            min: { value: 1, message: "Min: 1" },
            max: { value: 999_999, message: "Max: 999 999" },
          }}
          error={errors.price?.message}
          fullWidth
        />
        <FormInput<ICreationFormData>
          type="file"
          label="Image"
          name="image"
          register={register}
          options={
            location.pathname.startsWith("/update")
              ? {}
              : { required: "Please provide image" }
          }
          // @ts-ignore
          error={errors.image?.message}
          fullWidth
        />
        <FormTextArea<ICreationFormData>
          label="Description"
          name="description"
          register={register}
          options={{
            required: "Please provide description",
            maxLength: { value: 600, message: "Max length: 600" },
          }}
          error={errors.description?.message}
          rows={5}
        />
        <FormInput<ICreationFormData>
          label="Location"
          name="location"
          register={register}
          options={{
            required: "Please provide location",
            minLength: { value: 2, message: "Min length: 2" },
            maxLength: { value: 60, message: "Max length: 60" },
          }}
          error={errors.location?.message}
          fullWidth
        />
        <FormInput<ICreationFormData>
          label="Email"
          name="email"
          register={register}
          options={{
            required: "Please provide email",
            pattern: {
              value:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "Please provide a valid email",
            },
          }}
          error={errors.email?.message}
          fullWidth
        />
        <FormInput<ICreationFormData>
          label="Phone Number"
          name="phoneNumber"
          register={register}
          options={{
            required: "Please provide phone number",
            minLength: { value: 10, message: "Min length: 10" },
            maxLength: { value: 13, message: "Max length: 13" },
          }}
          error={errors.phoneNumber?.message}
          fullWidth
        />
        {isAnnouncementCreating || isAnnouncementUpdating ? (
          <Loader />
        ) : (
          <Button>{announcementId ? "Update" : "Create"}</Button>
        )}
      </form>
    </Wrapper>
  );
};

export default CreationPage;
