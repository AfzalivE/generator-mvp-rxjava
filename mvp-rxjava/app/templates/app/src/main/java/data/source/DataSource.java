package <%= appPackage %>.data.source;

import <%= appPackage %>.data.models.Post;

import java.util.List;

import rx.Observable;

/**
 * Created by afzal on 2016-11-19.
 */
public interface DataSource {
    Observable<List<Post>> getPosts();
}
