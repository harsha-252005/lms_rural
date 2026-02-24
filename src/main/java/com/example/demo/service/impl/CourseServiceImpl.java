package com.example.demo.service.impl;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Course;
import com.example.demo.model.Instructor;
import com.example.demo.model.Video;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.InstructorRepository;
import com.example.demo.repository.VideoRepository;
import com.example.demo.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final InstructorRepository instructorRepository;
    private final VideoRepository videoRepository;

    private static final String UPLOAD_DIR = "uploads";

    @Override
    public Course createCourse(Course course, Long instructorId) {
        Instructor instructor = instructorRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found with id " + instructorId));
        course.setInstructor(instructor);
        return courseRepository.save(course);
    }

    @Override
    public Course createCourseWithVideos(String title, String description, String classLevel,
            String category, String status, Long instructorId,
            MultipartFile thumbnail, List<MultipartFile> videos) {
        // 1. Find instructor
        Instructor instructor = instructorRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found with id " + instructorId));

        // 2. Create & save course first to get the ID
        Course course = new Course();
        course.setTitle(title);
        course.setDescription(description);
        course.setClassLevel(classLevel);
        course.setCategory(category);
        course.setStatus(status != null ? status : "Draft");
        course.setInstructor(instructor);
        Course savedCourse = courseRepository.save(course);

        // 3. Save thumbnail
        if (thumbnail != null && !thumbnail.isEmpty()) {
            try {
                Path thumbDir = Paths.get(UPLOAD_DIR, savedCourse.getId().toString(), "thumbnail");
                Files.createDirectories(thumbDir);
                String thumbFileName = thumbnail.getOriginalFilename();
                Path thumbPath = thumbDir.resolve(thumbFileName);
                Files.copy(thumbnail.getInputStream(), thumbPath, StandardCopyOption.REPLACE_EXISTING);
                savedCourse.setThumbnailPath("/uploads/" + savedCourse.getId() + "/thumbnail/" + thumbFileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save thumbnail: " + e.getMessage(), e);
            }
        }

        // 4. Save videos
        List<Video> videoEntities = new ArrayList<>();
        if (videos != null && !videos.isEmpty()) {
            try {
                Path videoDir = Paths.get(UPLOAD_DIR, savedCourse.getId().toString(), "videos");
                Files.createDirectories(videoDir);
                for (MultipartFile videoFile : videos) {
                    if (videoFile.isEmpty())
                        continue;
                    String videoFileName = videoFile.getOriginalFilename();
                    Path videoPath = videoDir.resolve(videoFileName);
                    Files.copy(videoFile.getInputStream(), videoPath, StandardCopyOption.REPLACE_EXISTING);

                    Video video = new Video();
                    video.setFileName(videoFileName);
                    video.setVideoPath("/uploads/" + savedCourse.getId() + "/videos/" + videoFileName);
                    video.setCourse(savedCourse);
                    videoEntities.add(video);
                }
                videoRepository.saveAll(videoEntities);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save videos: " + e.getMessage(), e);
            }
        }

        // 5. Update course with thumbnail path and return
        savedCourse.getVideos().addAll(videoEntities);
        return courseRepository.save(savedCourse);
    }

    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    @Override
    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    @Override
    public Course updateCourse(Long id, Course courseDetails) {
        return courseRepository.findById(id).map(course -> {
            course.setTitle(courseDetails.getTitle());
            course.setDescription(courseDetails.getDescription());
            course.setDuration(courseDetails.getDuration());
            if (courseDetails.getClassLevel() != null)
                course.setClassLevel(courseDetails.getClassLevel());
            if (courseDetails.getCategory() != null)
                course.setCategory(courseDetails.getCategory());
            if (courseDetails.getStatus() != null)
                course.setStatus(courseDetails.getStatus());
            return courseRepository.save(course);
        }).orElseThrow(() -> new ResourceNotFoundException("Course not found with id " + id));
    }

    @Override
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found with id " + id);
        }
        courseRepository.deleteById(id);
    }

    @Override
    public List<Course> getCoursesByInstructor(Long instructorId) {
        return courseRepository.findByInstructorId(instructorId);
    }
}
