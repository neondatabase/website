This is a reference for the `ContactChannel` type in the {sdkName} SDK.

Represents a contact method (email, phone, etc.) for a user.

`ContactChannel` represents a user's contact information, such as an email address or phone number. Some auth methods, like OTP/magic link or password, use contact channels for authentication.

On this page:

- [`ContactChannel`](#contactchannel)

## `ContactChannel`

Basic information about a contact channel, as seen by a user themselves.

Usually obtained by calling [`user.listContactChannels()`](/docs/neon-auth/sdk/nextjs/types/user#currentuserlistcontactchannels)
or [`user.useContactChannels()`](/docs/neon-auth/sdk/nextjs/types/user#currentuserusecontactchannels).

### Type Definition

```typescript
type ContactChannel = {
  id: string;
  value: string;
  type: 'email';
  isPrimary: boolean;
  isVerified: boolean;
  usedForAuth: boolean;

  sendVerificationEmail(): Promise<void>;
  update(options): Promise<void>;
  delete(): Promise<void>;
};
```

### `contactChannel.id`

The id of the contact channel as a `string`.

```typescript
declare const id: string;
```

### `contactChannel.value`

The value of the contact channel. If type is `"email"`, this is an email address.

```typescript
declare const value: string;
```

### `contactChannel.type`

The type of the contact channel. Currently always `"email"`.

```typescript
declare const type: 'email';
```

### `contactChannel.isPrimary`

Indicates whether the contact channel is the user's primary contact channel. If an email is set to primary, it will be the value on the `user.primaryEmail` field.

```typescript
declare const isPrimary: boolean;
```

### `contactChannel.isVerified`

Indicates whether the contact channel is verified.

```typescript
declare const isVerified: boolean;
```

### `contactChannel.usedForAuth`

Indicates whether the contact channel is used for authentication. If set to `true`, the user can use this contact channel with OTP or password to sign in.

```typescript
declare const usedForAuth: boolean;
```

### `contactChannel.sendVerificationEmail(options?)`

Sends a verification email to this contact channel. Once the user clicks the verification link in the email, the contact channel will be marked as verified.

#### Parameters

- `options`: An optional object containing:
  - `callbackUrl`: Optional URL to redirect to after verification

#### Returns

`Promise<void>`

```typescript
declare function sendVerificationEmail(options?: { callbackUrl?: string }): Promise<void>;
```

#### Example

```typescript
await contactChannel.sendVerificationEmail();
// or with callback URL
await contactChannel.sendVerificationEmail({
  callbackUrl: 'https://myapp.com/verify',
});
```

### `contactChannel.update(options)`

Updates the contact channel. After updating the value, the contact channel will be marked as unverified.

#### Parameters

- `options`: An object containing properties for updating.
  - `value`: The new value of the contact channel.
  - `type`: The new type of the contact channel. Currently always `"email"`.
  - `usedForAuth`: Indicates whether the contact channel is used for authentication.
  - `isPrimary`: Indicates whether the contact channel is the user's primary contact channel.

#### Returns

`Promise<void>`

```typescript
declare function update(options: {
  value?: string;
  type?: 'email';
  usedForAuth?: boolean;
  isPrimary?: boolean;
}): Promise<void>;
```

#### Example

```typescript
await contactChannel.update({ value: 'new-email@example.com' });
```

### `contactChannel.delete()`

Deletes the contact channel.

#### Parameters

None.

#### Returns

`Promise<void>`

```typescript
declare function delete(): Promise<void>;
```

#### Example

```typescript
await contactChannel.delete();
```
