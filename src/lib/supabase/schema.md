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
| `company_id` | `int8` |  |
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