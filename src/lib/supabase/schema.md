## Table `profile`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `created_at` | `timestamptz` |  |
| `name` | `text` |  Nullable |
| `email` | `text` |  Nullable |
| `avatar_url` | `text` |  Nullable |
| `whatsapp` | `text` |  Nullable |
| `role` | `COMPANY_MEMBER_ROLE` |  |
| `company_id` | `int8` |  Nullable |
| `company_member_area_id` | `int8` |  Nullable |

## Table `company`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `created_at` | `timestamptz` |  |
| `logo_url` | `text` |  Nullable |
| `owner_id` | `uuid` |  Nullable Unique |
| `name` | `text` |  |

## Table `company_member_area`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `created_at` | `timestamptz` |  |
| `company_id` | `int8` |  Nullable |
| `name` | `text` |  Nullable |

## Table `knowledge_category`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `created_at` | `timestamptz` |  |
| `company_id` | `int8` |  |
| `name` | `text` |  |
| `description` | `text` |  Nullable |

## Table `knowledge_entries`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `created_at` | `timestamptz` |  |
| `company_id` | `int8` |  |
| `knowledge_category_id` | `int8` |  |
| `content_plain` | `text` |  |
| `updated_at` | `timestamptz` |  |
| `embedding` | `vector` |  Nullable |
| `content_formatted` | `text` |  Nullable |

## Table `chat_conversation`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `created_at` | `timestamptz` |  |
| `company_id` | `int8` |  |
| `profile_id` | `uuid` |  Unique |

## Table `chat_message`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `created_at` | `timestamptz` |  |
| `chat_conversation_id` | `int8` |  Nullable |
| `role` | `CHAT_MESSAGE_ROLE` |  |
| `content` | `text` |  Nullable |

## Table `task`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `created_at` | `timestamptz` |  |
| `company_id` | `int8` |  |
| `title` | `text` |  |
| `description` | `text` |  |
| `status` | `TASK_STATUS` |  | -> (pending, in_progress, completed)
| `completed_at` | `timestamptz` |  Nullable |
| `assigned_to` | `uuid` |  |
| `created_by` | `uuid` |  |
| `deadline` | `timestamptz` |  Nullable |