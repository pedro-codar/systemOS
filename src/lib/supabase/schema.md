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
| `context_format` | `KNOWLEDGE_ENTRIES_CONTEXT_FORMAT` |  | 

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
| `pdf_url` | `text` |  Nullable |

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
| `status` | `TASK_STATUS` |  |
| `completed_at` | `timestamptz` |  Nullable |
| `assigned_to` | `uuid` |  |
| `created_by` | `uuid` |  |
| `deadline` | `timestamptz` |  Nullable |

## Table `knowledge_chunk`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int8` | Primary Identity |
| `knowledge_entry_id` | `int8` |  |
| `company_id` | `int8` |  |
| `chunk_index` | `int4` |  |
| `content` | `text` |  |
| `embedding` | `vector` |  Nullable |
| `created_at` | `timestamptz` |  |

## Custom Types / Enums

### `COMPANY_MEMBER_ROLE`

`admin` | `collaborator`

### `CHAT_MESSAGE_ROLE`

`agent` | `user`

### `TASK_STATUS`

`pending` | `in_progress` | `completed`

### `KNOWLEDGE_ENTRIES_CONTEXT_FORMAT`

`text` | `pdf`

## RLS Policies

### `knowledge_category`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `select knowledge_category` | SELECT | authenticated | PERMISSIVE | `(company_id = get_my_company_id())` | — |
| `insert knowledge_category` | INSERT | authenticated | PERMISSIVE | — | `((company_id = get_my_company_id()) AND (EXISTS ( SELECT 1    FROM company   WHERE ((company.id = get_my_company_id()) AND (company.owner_id = auth.uid())))))` |
| `update knowledge_category` | UPDATE | authenticated | PERMISSIVE | `((company_id = get_my_company_id()) AND (EXISTS ( SELECT 1    FROM company   WHERE ((company.id = get_my_company_id()) AND (company.owner_id = auth.uid())))))` | `(company_id = get_my_company_id())` |
| `delete knowledge_category` | DELETE | authenticated | PERMISSIVE | `((company_id = get_my_company_id()) AND (EXISTS ( SELECT 1    FROM company   WHERE ((company.id = get_my_company_id()) AND (company.owner_id = auth.uid())))))` | — |

### `profile`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `select profile` | SELECT | authenticated | PERMISSIVE | `(company_id = get_my_company_id())` | — |
| `update profile` | UPDATE | authenticated | PERMISSIVE | `(id = auth.uid())` | `((id = auth.uid()) AND (company_id = (get_my_profile()).company_id) AND (role = (get_my_profile()).role) AND (company_member_area_id = (get_my_profile()).company_member_area_id))` |

### `company`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `select company` | SELECT | authenticated | PERMISSIVE | `(id = get_my_company_id())` | — |
| `update company` | UPDATE | authenticated | PERMISSIVE | `(owner_id = auth.uid())` | `((owner_id = auth.uid()) AND (id = get_my_company_id()))` |

### `company_member_area`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `insert area` | INSERT | authenticated | PERMISSIVE | — | `(company_id = ( SELECT company.id    FROM company   WHERE (company.owner_id = auth.uid())))` |
| `select area` | SELECT | authenticated | PERMISSIVE | `(company_id = get_my_company_id())` | — |
| `update area` | UPDATE | authenticated | PERMISSIVE | `(company_id = ( SELECT company.id    FROM company   WHERE (company.owner_id = auth.uid())))` | `(company_id = ( SELECT company.id    FROM company   WHERE (company.owner_id = auth.uid())))` |
| `delete area` | DELETE | authenticated | PERMISSIVE | `(company_id = ( SELECT company.id    FROM company   WHERE (company.owner_id = auth.uid())))` | — |

### `knowledge_entries`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `select knowledge_entries` | SELECT | authenticated | PERMISSIVE | `(company_id = get_my_company_id())` | — |
| `insert knowledge_entries` | INSERT | authenticated | PERMISSIVE | — | `((company_id = get_my_company_id()) AND (EXISTS ( SELECT 1    FROM company   WHERE ((company.id = get_my_company_id()) AND (company.owner_id = auth.uid())))))` |
| `update knowledge_entries` | UPDATE | authenticated | PERMISSIVE | `((company_id = get_my_company_id()) AND (EXISTS ( SELECT 1    FROM company   WHERE ((company.id = get_my_company_id()) AND (company.owner_id = auth.uid())))))` | `(company_id = get_my_company_id())` |
| `delete knowledge_entries` | DELETE | authenticated | PERMISSIVE | `((company_id = get_my_company_id()) AND (EXISTS ( SELECT 1    FROM company   WHERE ((company.id = get_my_company_id()) AND (company.owner_id = auth.uid())))))` | — |

### `task`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `select task` | SELECT | authenticated | PERMISSIVE | `((company_id = get_my_company_id()) AND ((created_by = auth.uid()) OR (assigned_to = auth.uid())))` | — |
| `insert task` | INSERT | authenticated | PERMISSIVE | — | `((company_id = get_my_company_id()) AND (assigned_to IN ( SELECT profile.id    FROM profile   WHERE (profile.company_id = get_my_company_id()))) AND (created_by = auth.uid()))` |
| `delete task` | DELETE | authenticated | PERMISSIVE | `(created_by = auth.uid())` | — |
| `update task` | UPDATE | authenticated | PERMISSIVE | `((created_by = auth.uid()) OR (assigned_to = auth.uid()))` | `((company_id = get_my_company_id()) AND (assigned_to IN ( SELECT profile.id    FROM profile   WHERE (profile.company_id = get_my_company_id()))))` |

### `chat_conversation`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `select chat_conversations` | SELECT | authenticated | PERMISSIVE | `(profile_id = auth.uid())` | — |
| `insert chat_conversations` | INSERT | authenticated | PERMISSIVE | — | `((profile_id = auth.uid()) AND (company_id = get_my_company_id()))` |

### `chat_message`

| Policy | Command | Roles | Action | USING | WITH CHECK |
|--------|---------|-------|--------|-------|------------|
| `select chat_messages` | SELECT | authenticated | PERMISSIVE | `(chat_conversation_id IN ( SELECT chat_conversation.id    FROM chat_conversation   WHERE (chat_conversation.profile_id = auth.uid())))` | — |
| `insert chat_messages` | INSERT | authenticated | PERMISSIVE | — | `(chat_conversation_id IN ( SELECT chat_conversation.id    FROM chat_conversation   WHERE (chat_conversation.profile_id = auth.uid())))` |