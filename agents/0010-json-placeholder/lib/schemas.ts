import { z } from "zod";

export const idSchema = z.number().int().positive();

export const postFieldsSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  userId: idSchema,
});

export const commentFieldsSchema = z.object({
  postId: idSchema,
  name: z.string().min(1),
  email: z.string().email(),
  body: z.string().min(1),
});

export const albumFieldsSchema = z.object({
  userId: idSchema,
  title: z.string().min(1),
});

export const photoFieldsSchema = z.object({
  albumId: idSchema,
  title: z.string().min(1),
  url: z.string().url(),
  thumbnailUrl: z.string().url(),
});

export const todoFieldsSchema = z.object({
  userId: idSchema,
  title: z.string().min(1),
  completed: z.boolean(),
});

const addressSchema = z.object({
  street: z.string(),
  suite: z.string(),
  city: z.string(),
  zipcode: z.string(),
  geo: z.object({
    lat: z.string(),
    lng: z.string(),
  }),
});

const companySchema = z.object({
  name: z.string(),
  catchPhrase: z.string(),
  bs: z.string(),
});

export const userFieldsSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
  address: addressSchema,
  phone: z.string(),
  website: z.string(),
  company: companySchema,
});
