/*
 * Copyright 2016, The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package <%= appPackage %>.data;

import java.util.UUID;

import android.support.annotation.Nullable;

import com.google.common.base.Objects;
import io.realm.RealmObject;

/**
 * Model class for a Task.
 */
public class Task extends RealmObject {

    private String mId;

    @Nullable
    private String mTitle;

    @Nullable
    private String mDescription;

    private boolean mCompleted;

    public Task() {

    }

    /**
     * Use this constructor to create a new active Task.
     *
     * @param title
     * @param description
     */
    public Task(@Nullable String title, @Nullable String description) {
        mId = UUID.randomUUID().toString();
        mTitle = title;
        mDescription = description;
        mCompleted = false;
    }

    /**
     * Use this constructor to create an active Task if the Task already has an id (copy of another
     * Task).
     *
     * @param title
     * @param description
     * @param id          of the class
     */
    public Task(@Nullable String title, @Nullable String description, String id) {
        mId = id;
        mTitle = title;
        mDescription = description;
        mCompleted = false;
    }

    /**
     * Use this constructor to create a new completed Task.
     *
     * @param title
     * @param description
     * @param completed
     */
    public Task(@Nullable String title, @Nullable String description, boolean completed) {
        mId = UUID.randomUUID().toString();
        mTitle = title;
        mDescription = description;
        mCompleted = completed;
    }

    /**
     * Use this constructor to specify a completed Task if the Task already has an id (copy of
     * another Task).
     *
     * @param title
     * @param description
     * @param id
     * @param completed
     */
    public Task(@Nullable String title, @Nullable String description, String id, boolean completed) {
        mId = id;
        mTitle = title;
        mDescription = description;
        mCompleted = completed;
    }

    public String getId() {
        return mId;
    }

    @Nullable
    public String getTitle() {
        return mTitle;
    }

    @Nullable
    public String getTitleForList() {
        if (mTitle != null && !mTitle.equals("")) {
            return mTitle;
        } else {
            return mDescription;
        }
    }

    @Nullable
    public String getDescription() {
        return mDescription;
    }

    public boolean isCompleted() {
        return mCompleted;
    }

    public boolean isActive() {
        return !mCompleted;
    }

    public void setCompleted(boolean completed) {
        mCompleted = completed;
    }

    public boolean isEmpty() {
        return (mTitle == null || "".equals(mTitle)) &&
                (mDescription == null || "".equals(mDescription));
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Task task = (Task) o;
        return Objects.equal(mId, task.mId) &&
                Objects.equal(mTitle, task.mTitle) &&
                Objects.equal(mDescription, task.mDescription);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(mId, mTitle, mDescription);
    }

    @Override
    public String toString() {
        return "Task with title " + mTitle;
    }
}
