import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
};

export type CreateParticipantForm = {
  avatar?: InputMaybe<Scalars['String']>;
  bio: Scalars['String'];
  email: Scalars['String'];
  github: Scalars['String'];
  linkedin?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  twitter?: InputMaybe<Scalars['String']>;
};

export type GetParticipantsEdge = {
  __typename?: 'GetParticipantsEdge';
  participant: Participant;
};

export type GetParticipantsRes = {
  __typename?: 'GetParticipantsRes';
  edges: Array<GetParticipantsEdge>;
  total: Scalars['Int'];
};

export type LoginRes = {
  __typename?: 'LoginRes';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _: Scalars['Boolean'];
  createParticipant: Participant;
  login: LoginRes;
  refresh: Scalars['String'];
  register: Scalars['Boolean'];
  updateParticipant: Participant;
};


export type MutationCreateParticipantArgs = {
  form: CreateParticipantForm;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRefreshArgs = {
  refreshToken: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUpdateParticipantArgs = {
  form: UpdateParticipantForm;
  id: Scalars['ID'];
};

export type Participant = {
  __typename?: 'Participant';
  avatar: Scalars['String'];
  bio: Scalars['String'];
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  github: Scalars['String'];
  id: Scalars['ID'];
  linkedin?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  twitter?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  _: Scalars['Boolean'];
  getParticipant?: Maybe<Participant>;
  getParticipants: GetParticipantsRes;
};


export type QueryGetParticipantArgs = {
  id: Scalars['String'];
};


export type QueryGetParticipantsArgs = {
  search?: InputMaybe<Scalars['String']>;
  skip: Scalars['Int'];
  take: Scalars['Int'];
};

export type UpdateParticipantForm = {
  avatar?: InputMaybe<Scalars['String']>;
  bio: Scalars['String'];
  email: Scalars['String'];
  github: Scalars['String'];
  linkedin?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  twitter?: InputMaybe<Scalars['String']>;
};

export type GetAllParticipantsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllParticipantsQuery = { __typename?: 'Query', getParticipants: { __typename?: 'GetParticipantsRes', total: number, edges: Array<{ __typename?: 'GetParticipantsEdge', participant: { __typename?: 'Participant', id: string, name: string, github: string, avatar: string, bio: string, twitter?: string | null | undefined, linkedin?: string | null | undefined } }> } };

export type TestQueryVariables = Exact<{ [key: string]: never; }>;


export type TestQuery = { __typename?: 'Query', _: boolean };


export const GetAllParticipantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllParticipants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getParticipants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"skip"},"value":{"kind":"IntValue","value":"0"}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"participant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"github"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"twitter"}},{"kind":"Field","name":{"kind":"Name","value":"linkedin"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllParticipantsQuery, GetAllParticipantsQueryVariables>;
export const TestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Test"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"_"}}]}}]} as unknown as DocumentNode<TestQuery, TestQueryVariables>;