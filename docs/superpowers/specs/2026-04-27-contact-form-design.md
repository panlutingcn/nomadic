# Contact Form Design Spec

## Goal
Add a contact form at the bottom of the homepage that allows users to send emails to Luna (panluting.cn@gmail.com) with a story-driven, chat-bubble aesthetic.

## Architecture
Two-component system with Netlify Forms backend:
- **ContactBubble**: Entry point at homepage bottom with poetic copy
- **ContactModal**: Form modal with email fields and submission handling
- **Netlify Forms**: Handles form submission and email delivery without custom backend

## Tech Stack
- React components with TypeScript
- Netlify Forms for email delivery
- Fetch API for AJAX submission (no page refresh)
- Client-side validation

---

## Component Design

### ContactBubble Component

**Purpose**: Visual entry point that invites users to connect with Luna.

**Location**: Bottom of homepage (`app/page.tsx`), after two blank lines of spacing.

**Visual Style**:
- Chat bubble shape: rounded rectangle with small tail on the left side
- Background: light color (#f5f5f5 or similar)
- Text color: light gray (#999 or similar)
- Hover effect: slight scale-up (1.02-1.05)
- Cursor: pointer

**Copy**:
```
这是旅行者Luna用代码写给自己的情书。如果它也触动了你，欢迎来信交流
```

**Behavior**:
- Click opens ContactModal
- Hover shows subtle animation

**File**: `components/ContactBubble.tsx`

### ContactModal Component

**Purpose**: Form interface for users to compose and send emails to Luna.

**Visual Structure**:
- Overlay: semi-transparent black background (rgba(0,0,0,0.5))
- Modal: centered white card with rounded corners and shadow
- Close button: X icon in top-right corner

**Header**:
- Title: "给Luna写信"
- Recipient display: "收件人: panluting.cn@gmail.com" (read-only, gray text)

**Form Fields**:
1. **Your Email** (`user-email`)
   - Type: email input
   - Required: yes
   - Validation: valid email format
   - Placeholder: "your@email.com"

2. **Subject** (`subject`)
   - Type: text input
   - Required: yes
   - Validation: not empty
   - Placeholder: "邮件主题"

3. **Message** (`message`)
   - Type: textarea (multi-line)
   - Required: yes
   - Validation: minimum 10 characters
   - Placeholder: "想对Luna说的话..."
   - Rows: 6-8

**Buttons**:
- **Cancel**: secondary style, left side, closes modal
- **Send**: primary style (accent color), right side, submits form

**States**:
1. **Default**: All fields enabled, send button active
2. **Loading**: 
   - Send button shows loading spinner
   - All inputs disabled
   - Text: "发送中..."
3. **Success**:
   - Show success message: "✓ 已发送！Luna会尽快回复你"
   - Green checkmark icon
   - Auto-close after 3 seconds
4. **Error**:
   - Show error message below form
   - Keep modal open for retry
   - Re-enable all inputs

**File**: `components/ContactModal.tsx`

---

## Netlify Forms Integration

### Hidden Form Setup

**Location**: `app/page.tsx` (hidden in the DOM)

**Purpose**: Netlify detects forms at build time by scanning HTML. A hidden form with `data-netlify="true"` tells Netlify to set up the form endpoint.

**HTML Structure**:
```html
<form name="contact" data-netlify="true" hidden>
  <input type="email" name="user-email" />
  <input type="text" name="subject" />
  <textarea name="message"></textarea>
</form>
```

**Key Attributes**:
- `name="contact"`: Form identifier
- `data-netlify="true"`: Enables Netlify Forms
- `hidden`: Not visible to users (actual form is in modal)

### Form Submission

**Method**: POST via fetch API

**Endpoint**: `/` (root path)

**Content-Type**: `application/x-www-form-urlencoded`

**Payload Format**:
```
form-name=contact&user-email=user@example.com&subject=Hello&message=Message text
```

**Submission Flow**:
1. User clicks "Send" button
2. Client-side validation runs
3. If valid, construct form data with `form-name` field
4. Encode as URL parameters
5. POST to `/` with proper headers
6. Handle response (success/error)

**Code Pattern**:
```typescript
const formData = new URLSearchParams({
  'form-name': 'contact',
  'user-email': email,
  'subject': subject,
  'message': message
})

const response = await fetch('/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: formData.toString()
})
```

### Email Notification

**Netlify Configuration**:
- Netlify automatically sends form submissions to the site owner's email
- Configure notification email in: Netlify Dashboard → Site Settings → Forms → Form notifications
- Set notification email to: panluting.cn@gmail.com

**Email Content**:
- Subject: "New form submission: contact"
- Body includes all form fields:
  - user-email
  - subject
  - message
- Timestamp of submission

---

## Validation Rules

### Client-Side Validation

**Email Field**:
- Required: yes
- Format: valid email (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Error message: "请输入有效的邮箱地址"

**Subject Field**:
- Required: yes
- Min length: 1 character
- Max length: 200 characters
- Error message: "请填写邮件主题"

**Message Field**:
- Required: yes
- Min length: 10 characters
- Max length: 5000 characters
- Error message: "内容至少需要10个字符"

**Validation Timing**:
- On submit: validate all fields
- On blur: validate individual field (optional, for better UX)
- Show error messages below each field in red text

---

## Error Handling

### Network Errors
**Scenario**: Fetch fails due to network issues

**Handling**:
- Show error message: "发送失败，请检查网络连接"
- Keep modal open
- Re-enable form for retry

### Validation Errors
**Scenario**: Client-side validation fails

**Handling**:
- Highlight invalid fields with red border
- Show specific error message below each field
- Don't submit to server
- Keep modal open

### Server Errors
**Scenario**: Netlify returns error (spam filter, rate limit, etc.)

**Handling**:
- Show error message: "提交失败，请稍后重试"
- Keep modal open
- Re-enable form for retry
- Log error to console for debugging

### Success Handling
**Scenario**: Form submitted successfully

**Handling**:
- Show success message with checkmark
- Disable form inputs
- Auto-close modal after 3 seconds
- Clear form fields (for next use)

---

## File Structure

```
app/
  page.tsx                    # Add ContactBubble + hidden Netlify form
components/
  ContactBubble.tsx          # Entry point component (new)
  ContactModal.tsx           # Form modal component (new)
```

---

## Integration Points

### Homepage Integration
**File**: `app/page.tsx`

**Changes**:
1. Import ContactBubble component
2. Add hidden Netlify form (for build-time detection)
3. Place ContactBubble at bottom, after two blank lines
4. Add state for modal visibility (if not using ContactBubble's internal state)

**Placement**:
- After the globe map section
- Before BottomNav component
- Add `marginTop: 48` (two blank lines) for spacing

### State Management
**Approach**: Local component state (no AppContext needed)

**ContactBubble State**:
- `showModal`: boolean (controls ContactModal visibility)

**ContactModal State**:
- `email`: string
- `subject`: string
- `message`: string
- `loading`: boolean
- `success`: boolean
- `error`: string | null

---

## Testing Checklist

### Functional Testing
- [ ] Click bubble opens modal
- [ ] Click cancel/X closes modal
- [ ] Click overlay closes modal
- [ ] Form validation works for each field
- [ ] Submit button disabled during loading
- [ ] Success message appears after submission
- [ ] Modal auto-closes after 3 seconds on success
- [ ] Error messages display correctly
- [ ] Form clears after successful submission

### Visual Testing
- [ ] Bubble has correct chat-bubble style with tail
- [ ] Bubble text is light gray and readable
- [ ] Modal is centered and has proper shadow
- [ ] Form fields are properly aligned
- [ ] Buttons have correct styling and spacing
- [ ] Loading spinner appears during submission
- [ ] Success/error messages are visually distinct

### Integration Testing
- [ ] Hidden Netlify form exists in DOM
- [ ] Form submission reaches Netlify
- [ ] Email notification arrives at panluting.cn@gmail.com
- [ ] Email contains all form fields
- [ ] Spam submissions are filtered by Netlify

### Responsive Testing
- [ ] Modal fits on mobile screens (375px)
- [ ] Bubble text wraps properly on mobile
- [ ] Form fields are usable on touch devices
- [ ] Buttons are large enough for touch

---

## Deployment Notes

### Netlify Configuration
1. Deploy the app with hidden form in HTML
2. Netlify will detect the form during build
3. Go to Netlify Dashboard → Site Settings → Forms
4. Verify "contact" form appears in the list
5. Set up form notifications:
   - Email to send: panluting.cn@gmail.com
   - Enable "Email notification" for new submissions

### Environment Variables
None required (Netlify Forms works without API keys)

### Build Verification
After deployment, check:
- Hidden form exists in production HTML
- Form appears in Netlify Dashboard
- Test submission sends email successfully

---

## Future Enhancements (Out of Scope)

- Spam protection (reCAPTCHA)
- File attachments
- Auto-reply to user
- Form submission history in dashboard
- Multi-language support
- Rich text editor for message field
